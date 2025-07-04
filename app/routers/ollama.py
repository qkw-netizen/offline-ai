from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
from typing import Dict, Any, Optional, List

router = APIRouter()

OLLAMA_API_URL = "http://localhost:11434/api/generate"

class OllamaRequest(BaseModel):
    model: str = "deepseek-coder:1.3b"
    prompt: str
    system: Optional[str] = None
    context: Optional[List[int]] = None
    stream: bool = False
    options: Optional[Dict[str, Any]] = None

class OllamaResponse(BaseModel):
    model: str
    response: str
    context: Optional[List[int]] = None

@router.post("/generate", response_model=OllamaResponse)
async def generate_text(request: OllamaRequest):
    """
    Generate text using Ollama's local API
    """
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                OLLAMA_API_URL,
                json=request.dict(exclude_none=True)
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Ollama API error: {response.text}"
                )
                
            result = response.json()
            return OllamaResponse(
                model=result.get("model", request.model),
                response=result.get("response", ""),
                context=result.get("context")
            )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Error connecting to Ollama API: {str(e)}"
        )