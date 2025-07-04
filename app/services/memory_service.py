from typing import Dict, Any, List, Optional
import os
import uuid
import chromadb
from chromadb.utils import embedding_functions

class MemoryService:
    def __init__(self):
        # Use in-memory client to avoid schema issues
        self.client = chromadb.Client()
        
        # Use default embedding function
        self.embedding_function = embedding_functions.DefaultEmbeddingFunction()
        
        # Create or get the collection
        self.collection = self.client.get_or_create_collection(
            name="memory",
            embedding_function=self.embedding_function
        )
    
    async def store(self, content: str, metadata: Optional[Dict[str, Any]] = None) -> str:
        """Store a memory item in the vector database"""
        id = str(uuid.uuid4())
        
        self.collection.add(
            documents=[content],
            metadatas=[metadata or {}],
            ids=[id]
        )
        
        return id
    
    async def query(self, query: str, k: int = 5, filter_metadata: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Query the vector database for similar memories"""
        results = self.collection.query(
            query_texts=[query],
            n_results=k,
            where=filter_metadata
        )
        
        items = []
        for i in range(len(results["ids"][0])):
            items.append({
                "id": results["ids"][0][i],
                "content": results["documents"][0][i],
                "metadata": results["metadatas"][0][i],
                "distance": results["distances"][0][i] if "distances" in results else None
            })
        
        return items
    
    async def clear(self) -> None:
        """Clear all memories from the vector database"""
        self.collection.delete(where={})

def get_memory_service():
    """Dependency injection for MemoryService"""
    return MemoryService()