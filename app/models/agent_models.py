from enum import Enum
from pydantic import BaseModel
from typing import Dict, Any, List, Optional

class AgentRole(str, Enum):
    PLANNER = "PlannerAgent"
    CODE = "CodeAgent"
    RED_TEAM = "RedTeamAgent"
    EVALUATOR = "EvaluatorAgent"
    EXECUTOR = "ExecutorAgent"

class AgentTask(BaseModel):
    role: AgentRole
    task: str
    context: Dict[str, Any] = {}
    tools: List[str] = []

class AgentStep(BaseModel):
    thought: str
    action: str
    action_input: Dict[str, Any] = {}
    observation: str = ""

class AgentResponse(BaseModel):
    role: AgentRole
    task: str
    result: str
    steps: List[AgentStep] = []
    artifacts: Dict[str, Any] = {}
    status: str = "success"
    error: Optional[str] = None

class RedTeamPayload(BaseModel):
    name: str
    description: str
    code: str
    target: str
    technique: str
    mitre_id: Optional[str] = None
    severity: str = "medium"
    metadata: Dict[str, Any] = {}