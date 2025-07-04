from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.memory_service import MemoryService, get_memory_service

router = APIRouter()

class MemoryItem(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = None

class QueryRequest(BaseModel):
    query: str
    k: int = 5
    filter_metadata: Optional[Dict[str, Any]] = None

class MemoryResponse(BaseModel):
    items: List[Dict[str, Any]]
    count: int

@router.post("/store", response_model=Dict[str, str])
async def store_memory(
    item: MemoryItem,
    memory_service: MemoryService = Depends(get_memory_service)
):
    """
    Store a new memory item in the vector database
    """
    try:
        id = await memory_service.store(item.content, item.metadata)
        return {"id": id, "status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Memory storage error: {str(e)}"
        )

@router.post("/query", response_model=MemoryResponse)
async def query_memory(
    query: QueryRequest,
    memory_service: MemoryService = Depends(get_memory_service)
):
    """
    Query the vector database for similar memories
    """
    try:
        results = await memory_service.query(
            query.query, 
            k=query.k, 
            filter_metadata=query.filter_metadata
        )
        return MemoryResponse(items=results, count=len(results))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Memory query error: {str(e)}"
        )

@router.delete("/clear", response_model=Dict[str, str])
async def clear_memory(
    memory_service: MemoryService = Depends(get_memory_service)
):
    """
    Clear all memories from the vector database
    """
    try:
        await memory_service.clear()
        return {"status": "success", "message": "Memory cleared successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Memory clear error: {str(e)}"
        )