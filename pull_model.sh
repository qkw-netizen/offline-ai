#!/bin/bash

echo "Pulling deepseek-coder:1.3b model from Ollama..."
ollama pull deepseek-coder:1.3b

echo "Model pulled successfully!"
echo "You can now run the system using ./run.sh or docker-compose up"