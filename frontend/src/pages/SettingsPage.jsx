import { useState, useEffect } from 'react'
import { FaCog, FaTrash, FaSave } from 'react-icons/fa'
import { useMemory } from '../contexts/MemoryContext'
import DebugConsole from '../components/DebugConsole'

const SettingsPage = () => {
  const { clearMemories } = useMemory()
  const [ollamaSettings, setOllamaSettings] = useState({
    apiUrl: 'http://localhost:11434/api',
    model: 'deepseek-coder:1.3b',
    temperature: 0.7,
    maxTokens: 2048
  })
  const [logs, setLogs] = useState([])
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  
  useEffect(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('ollamaSettings')
    if (savedSettings) {
      setOllamaSettings(JSON.parse(savedSettings))
    }
  }, [])
  
  const addLog = (level, message, details = null) => {
    setLogs(prev => [
      {
        level,
        message,
        timestamp: new Date().toISOString(),
        details
      },
      ...prev
    ])
  }
  
  const clearLogs = () => {
    setLogs([])
  }
  
  const handleClearMemories = async () => {
    try {
      await clearMemories()
      addLog('success', 'Memory database cleared successfully')
    } catch (error) {
      addLog('error', 'Failed to clear memory database', { error: error.message })
    }
  }
  
  const handleSaveSettings = () => {
    localStorage.setItem('ollamaSettings', JSON.stringify(ollamaSettings))
    addLog('success', 'Settings saved successfully')
  }
  
  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    addLog('info', 'Testing connection to Ollama API...')
    
    try {
      const response = await fetch('/api/ollama/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ollamaSettings.model,
          prompt: 'Hello, are you working?',
          stream: false
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        addLog('success', 'Successfully connected to Ollama API', { 
          model: data.model,
          response: data.response
        })
      } else {
        const errorText = await response.text()
        addLog('error', 'Failed to connect to Ollama API', { 
          status: response.status,
          error: errorText
        })
      }
    } catch (error) {
      addLog('error', 'Connection error', { error: error.message })
    } finally {
      setIsTestingConnection(false)
    }
  }
  
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center">
        <FaCog className="h-6 w-6 text-gray-400" />
        <h1 className="text-2xl font-bold ml-2">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
          <h2 className="text-lg font-semibold mb-4">Ollama Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                API URL
              </label>
              <input
                type="text"
                value={ollamaSettings.apiUrl}
                onChange={(e) => setOllamaSettings({...ollamaSettings, apiUrl: e.target.value})}
                className="w-full bg-dark-800 border border-dark-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Model
              </label>
              <input
                type="text"
                value={ollamaSettings.model}
                onChange={(e) => setOllamaSettings({...ollamaSettings, model: e.target.value})}
                className="w-full bg-dark-800 border border-dark-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Temperature
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={ollamaSettings.temperature}
                onChange={(e) => setOllamaSettings({...ollamaSettings, temperature: parseFloat(e.target.value)})}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0 (Deterministic)</span>
                <span>{ollamaSettings.temperature}</span>
                <span>1 (Creative)</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Max Tokens
              </label>
              <input
                type="number"
                min="1"
                max="4096"
                value={ollamaSettings.maxTokens}
                onChange={(e) => setOllamaSettings({...ollamaSettings, maxTokens: parseInt(e.target.value)})}
                className="w-full bg-dark-800 border border-dark-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleSaveSettings}
                className="flex items-center px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 focus:outline-none"
              >
                <FaSave className="mr-2 h-4 w-4" />
                Save Settings
              </button>
              
              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className={`flex items-center px-4 py-2 rounded-md bg-secondary-600 text-white focus:outline-none ${
                  isTestingConnection ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary-700'
                }`}
              >
                {isTestingConnection ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
          <h2 className="text-lg font-semibold mb-4">System Management</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-dark-800 rounded-md border border-dark-600">
              <h3 className="font-medium text-danger-500">Danger Zone</h3>
              <p className="text-sm text-gray-400 mt-1">
                These actions cannot be undone. Please be certain.
              </p>
              
              <div className="mt-4">
                <button
                  onClick={handleClearMemories}
                  className="flex items-center px-4 py-2 rounded-md bg-danger-600 text-white hover:bg-danger-700 focus:outline-none"
                >
                  <FaTrash className="mr-2 h-4 w-4" />
                  Clear Memory Database
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-dark-800 rounded-md border border-dark-600">
              <h3 className="font-medium">System Information</h3>
              
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Version:</span>
                  <span>1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Backend Status:</span>
                  <span className="text-green-500">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ollama Model:</span>
                  <span>{ollamaSettings.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Environment:</span>
                  <span>Browser</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <DebugConsole logs={logs} onClear={clearLogs} />
    </div>
  )
}

export default SettingsPage