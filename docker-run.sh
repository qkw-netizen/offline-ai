#!/bin/bash

echo "Starting Offline AI System using Docker Compose..."
docker-compose up -d

echo "Services started!"
echo "Backend running at: http://localhost:12000"
echo "Frontend running at: http://localhost:12001"
echo "Ollama API running at: http://localhost:11434"
echo ""
echo "To stop the services, run: docker-compose down"