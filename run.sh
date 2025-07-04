#!/bin/bash

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "Warning: Ollama API is not accessible at http://localhost:11434/api"
    echo "Make sure Ollama is running and the deepseek-coder:1.3b model is available."
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Start backend and frontend in separate terminals
echo "Starting backend and frontend..."

# Start backend
echo "Starting backend on port 12000..."
python -m uvicorn app.main:app --host 0.0.0.0 --port 12000 &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend on port 12001..."
cd frontend
npm run dev &
FRONTEND_PID=$!

# Function to handle script termination
function cleanup {
    echo "Shutting down services..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

# Register the cleanup function for script termination
trap cleanup SIGINT SIGTERM

echo "Services started!"
echo "Backend running at: http://localhost:12000"
echo "Frontend running at: http://localhost:12001"
echo "Press Ctrl+C to stop all services."

# Keep the script running
wait