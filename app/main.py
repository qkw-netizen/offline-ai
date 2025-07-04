from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.routers import ollama, agents, memory

app = FastAPI(
    title="Offline AI System",
    description="A production-grade full-stack AI system that runs entirely in the browser and uses Ollama's local API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ollama.router, prefix="/api/ollama", tags=["Ollama"])
app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])
app.include_router(memory.router, prefix="/api/memory", tags=["Memory"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Offline AI System API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=12000, reload=True)