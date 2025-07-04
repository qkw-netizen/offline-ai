from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.agent_service import AgentService, get_agent_service
from app.models.agent_models import AgentRole, AgentTask, AgentResponse

router = APIRouter()

class AgentExecuteRequest(BaseModel):
    role: AgentRole
    task: str
    context: Optional[Dict[str, Any]] = None
    tools: Optional[List[str]] = None

@router.post("/execute", response_model=AgentResponse)
async def execute_agent_task(
    request: AgentExecuteRequest,
    agent_service: AgentService = Depends(get_agent_service)
):
    """
    Execute a task using the specified agent role
    """
    try:
        agent_task = AgentTask(
            role=request.role,
            task=request.task,
            context=request.context or {},
            tools=request.tools or []
        )
        
        response = await agent_service.execute_task(agent_task)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Agent execution error: {str(e)}"
        )

@router.get("/roles", response_model=List[str])
async def get_available_roles():
    """
    Get all available agent roles
    """
    return [role.value for role in AgentRole]

@router.post("/multi-agent", response_model=AgentResponse)
async def execute_multi_agent_workflow(
    request: Dict[str, Any],
    agent_service: AgentService = Depends(get_agent_service)
):
    """
    Execute a multi-agent workflow for complex tasks
    """
    try:
        return await agent_service.execute_multi_agent_workflow(request)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Multi-agent workflow error: {str(e)}"
        )