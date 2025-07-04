from typing import Dict, Any, List, Optional
import json
import httpx
from app.models.agent_models import AgentRole, AgentTask, AgentResponse, AgentStep
from app.services.memory_service import MemoryService, get_memory_service

OLLAMA_API_URL = "http://localhost:11434/api/generate"

class AgentService:
    def __init__(self, memory_service: MemoryService):
        self.memory_service = memory_service
        self.system_prompts = {
            AgentRole.PLANNER: """You are an elite PlannerAgent responsible for breaking down complex tasks into clear, actionable steps. 
Your job is to analyze the task, identify the key components, and create a detailed plan for execution.
Focus on creating realistic, production-grade plans that can be implemented by other agents.
Output only the plan steps in a clear, structured format. Do not include explanations or disclaimers.""",
            
            AgentRole.CODE: """You are an elite CodeAgent responsible for generating production-grade code based on specifications.
Your job is to write clean, efficient, and secure code that implements the requested functionality.
Focus on writing real, working code that can be directly used in production environments.
Output only the code with minimal comments. Do not include explanations or disclaimers.""",
            
            AgentRole.RED_TEAM: """You are an elite RedTeamAgent responsible for identifying security vulnerabilities and creating offensive security tools.
Your job is to analyze systems, identify weaknesses, and develop realistic exploits and payloads.
Focus on creating real, working red team tools and techniques that can be used in security assessments.
Output only the attack methodology, exploits, or payloads. Do not include explanations or disclaimers.""",
            
            AgentRole.EVALUATOR: """You are an elite EvaluatorAgent responsible for assessing the quality and effectiveness of solutions.
Your job is to analyze code, plans, or security techniques and provide detailed feedback on their strengths and weaknesses.
Focus on identifying potential issues, suggesting improvements, and validating that solutions meet requirements.
Output only your evaluation in a clear, structured format. Do not include explanations or disclaimers.""",
            
            AgentRole.EXECUTOR: """You are an elite ExecutorAgent responsible for implementing and executing plans or code.
Your job is to take plans or code and execute them, reporting on the results and any issues encountered.
Focus on providing detailed, accurate reports of execution results that can be used to improve solutions.
Output only the execution results in a clear, structured format. Do not include explanations or disclaimers."""
        }
    
    async def _call_ollama(self, prompt: str, system: str, context: Optional[List[int]] = None) -> str:
        """Call the Ollama API with the given prompt and system message"""
        try:
            payload = {
                "model": "deepseek-coder:1.3b",
                "prompt": prompt,
                "system": system,
                "stream": False
            }
            
            if context:
                payload["context"] = context
                
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(OLLAMA_API_URL, json=payload)
                response.raise_for_status()
                return response.json().get("response", "")
        except Exception as e:
            raise Exception(f"Error calling Ollama API: {str(e)}")
    
    async def execute_task(self, task: AgentTask) -> AgentResponse:
        """Execute a task using the specified agent role"""
        system_prompt = self.system_prompts.get(task.role, "You are an AI assistant.")
        
        # Retrieve relevant memories
        memories = await self.memory_service.query(task.task, k=5)
        memory_context = "\n\n".join([f"Memory {i+1}: {m['content']}" for i, m in enumerate(memories)])
        
        # Construct the full prompt
        full_prompt = f"""Task: {task.task}

Context:
{json.dumps(task.context, indent=2)}

Available Tools:
{', '.join(task.tools)}

Relevant Memories:
{memory_context}

Execute this task as a {task.role.value} and provide a detailed response."""

        # Execute the agent's reasoning process
        steps = []
        
        # Initial thought
        thought = await self._call_ollama(
            f"What is my first thought about how to approach this task: {task.task}?",
            system_prompt
        )
        
        # Action planning
        action = await self._call_ollama(
            f"Based on my thought: {thought}\nWhat specific action should I take to address this task?",
            system_prompt
        )
        
        # Execute action
        action_input = task.context
        observation = await self._call_ollama(
            f"Task: {task.task}\nThought: {thought}\nAction: {action}\nAction Input: {json.dumps(action_input)}\nWhat is the result of this action?",
            system_prompt
        )
        
        steps.append(AgentStep(
            thought=thought,
            action=action,
            action_input=action_input,
            observation=observation
        ))
        
        # Final result
        result = await self._call_ollama(
            f"Task: {task.task}\nBased on my steps:\n{json.dumps([step.dict() for step in steps], indent=2)}\nWhat is my final result or answer?",
            system_prompt
        )
        
        # Store the interaction in memory
        await self.memory_service.store(
            f"Task: {task.task}\nRole: {task.role.value}\nResult: {result}",
            {"role": task.role.value, "task": task.task}
        )
        
        return AgentResponse(
            role=task.role,
            task=task.task,
            result=result,
            steps=steps,
            artifacts={"raw_result": result}
        )
    
    async def execute_multi_agent_workflow(self, request: Dict[str, Any]) -> AgentResponse:
        """Execute a multi-agent workflow for complex tasks"""
        task = request.get("task", "")
        workflow = request.get("workflow", ["PLANNER", "CODE", "EVALUATOR"])
        context = request.get("context", {})
        
        results = []
        current_context = context.copy()
        
        for role_name in workflow:
            try:
                role = AgentRole(role_name)
            except ValueError:
                role = AgentRole.PLANNER
                
            agent_task = AgentTask(
                role=role,
                task=task,
                context=current_context
            )
            
            response = await self.execute_task(agent_task)
            results.append(response)
            
            # Update context with the result from this agent
            current_context["previous_result"] = response.result
            current_context[f"{role.value}_result"] = response.result
        
        # Combine results from all agents
        final_result = "\n\n".join([f"## {r.role.value} Result\n{r.result}" for r in results])
        
        return AgentResponse(
            role=AgentRole(workflow[-1]),
            task=task,
            result=final_result,
            steps=[step for r in results for step in r.steps],
            artifacts={"agent_results": [r.dict() for r in results]}
        )

def get_agent_service():
    """Dependency injection for AgentService"""
    memory_service = get_memory_service()
    return AgentService(memory_service)