# Offline AI System

A production-grade full-stack AI system that runs entirely in the browser and uses Ollama's local API to support autonomous code generation and red teaming operations.

## Features

- 🧠 **Browser-Based Interface**: Rich UI with React.js + Tailwind CSS
- 🤖 **Multi-Agent System**: PlannerAgent, CodeAgent, RedTeamAgent, and more
- 🔒 **Local Execution**: All processing happens on your machine
- 💾 **Memory System**: Store and retrieve past interactions
- 🛠️ **Red Team Operations**: Generate security payloads and exploits

## Requirements

- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js 16+](https://nodejs.org/)
- [Ollama](https://ollama.ai/) with the `deepseek-coder:1.3b` model

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/offline-ai.git
   cd offline-ai
   ```

2. Install Ollama and pull the required model:
   ```bash
   # Follow instructions at https://ollama.ai/ to install Ollama
   ollama pull deepseek-coder:1.3b
   ```

3. Run the setup script:
   ```bash
   ./run.sh
   ```

## Usage

1. Access the frontend at: http://localhost:12001
2. Choose an agent role from the sidebar
3. Enter your task or prompt in the chat interface
4. View and execute generated code in the code editor
5. Use the Red Team page for security-focused operations

## Architecture

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Python FastAPI
- **LLM Integration**: Ollama API with deepseek-coder:1.3b
- **Memory**: ChromaDB for vector storage

## Security Notice

This tool is designed for educational and authorized security testing purposes only. Always use responsibly and only on systems you have permission to test.

## License

MIT
