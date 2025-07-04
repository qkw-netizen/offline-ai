import { useState } from 'react'
import { FaShieldAlt, FaPlay, FaSave, FaDownload } from 'react-icons/fa'
import { useAgent } from '../contexts/AgentContext'
import CodeEditor from '../components/CodeEditor'
import DebugConsole from '../components/DebugConsole'

const RedTeamPage = () => {
  const { executeAgent } = useAgent()
  const [target, setTarget] = useState('')
  const [technique, setTechnique] = useState('jwt-bypass')
  const [payload, setPayload] = useState('')
  const [logs, setLogs] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedPayloads, setSavedPayloads] = useState([])
  
  const techniques = [
    { id: 'jwt-bypass', name: 'JWT Bypass' },
    { id: 'graphql-injection', name: 'GraphQL Injection' },
    { id: 'ssrf', name: 'Server-Side Request Forgery' },
    { id: 'prototype-pollution', name: 'Prototype Pollution' },
    { id: 'command-injection', name: 'Command Injection' },
    { id: 'azure-pivoting', name: 'Azure Pivoting' },
    { id: 'cicd-abuse', name: 'CI/CD Pipeline Abuse' }
  ]
  
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
  
  const generatePayload = async () => {
    if (!target || !technique) {
      addLog('error', 'Target and technique are required')
      return
    }
    
    setIsGenerating(true)
    addLog('info', `Generating ${technique} payload for ${target}...`)
    
    try {
      const result = await executeAgent(`Generate a ${technique} payload for ${target}`, {
        technique,
        target
      })
      
      setPayload(result.result)
      addLog('success', 'Payload generated successfully')
    } catch (error) {
      addLog('error', 'Payload generation failed', { error: error.message })
    } finally {
      setIsGenerating(false)
    }
  }
  
  const savePayload = () => {
    if (!payload.trim()) {
      addLog('error', 'No payload to save')
      return
    }
    
    const newPayload = {
      id: Date.now().toString(),
      name: `${technique} for ${target}`,
      technique,
      target,
      code: payload,
      timestamp: new Date().toISOString()
    }
    
    setSavedPayloads(prev => [newPayload, ...prev])
    addLog('success', 'Payload saved to library')
  }
  
  const downloadPayload = () => {
    if (!payload.trim()) {
      addLog('error', 'No payload to download')
      return
    }
    
    const element = document.createElement('a')
    const file = new Blob([payload], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${technique}-payload-${Date.now()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    
    addLog('info', 'Payload downloaded')
  }
  
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center">
        <FaShieldAlt className="h-6 w-6 text-danger-500" />
        <h1 className="text-2xl font-bold ml-2">Red Team Operations</h1>
      </div>
      
      <p className="text-gray-400">
        Generate and manage offensive security payloads for red team operations.
        All payloads are generated locally using the Ollama API.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
            <h2 className="text-lg font-semibold mb-4">Payload Generator</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Target System
                </label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g., JWT Authentication System, GraphQL API, etc."
                  className="w-full bg-dark-800 border border-dark-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Technique
                </label>
                <select
                  value={technique}
                  onChange={(e) => setTechnique(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {techniques.map(tech => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={generatePayload}
                  disabled={isGenerating || !target || !technique}
                  className={`flex items-center px-4 py-2 rounded-md bg-danger-600 text-white focus:outline-none ${
                    isGenerating || !target || !technique
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-danger-700'
                  }`}
                >
                  <FaPlay className="mr-2 h-4 w-4" />
                  Generate Payload
                </button>
                
                <button
                  onClick={savePayload}
                  disabled={!payload.trim()}
                  className={`flex items-center px-4 py-2 rounded-md bg-secondary-600 text-white focus:outline-none ${
                    !payload.trim()
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-secondary-700'
                  }`}
                >
                  <FaSave className="mr-2 h-4 w-4" />
                  Save to Library
                </button>
                
                <button
                  onClick={downloadPayload}
                  disabled={!payload.trim()}
                  className={`flex items-center px-4 py-2 rounded-md bg-primary-600 text-white focus:outline-none ${
                    !payload.trim()
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-primary-700'
                  }`}
                >
                  <FaDownload className="mr-2 h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <CodeEditor
              code={payload}
              language={technique.includes('jwt') ? 'javascript' : technique.includes('graphql') ? 'graphql' : 'python'}
              onChange={setPayload}
              height="300px"
            />
          </div>
        </div>
        
        <div className="bg-dark-700 rounded-lg border border-dark-600 overflow-hidden">
          <div className="px-4 py-3 bg-dark-800 border-b border-dark-600">
            <h2 className="font-semibold">Payload Library</h2>
          </div>
          
          <div className="p-4 h-[400px] overflow-y-auto">
            {savedPayloads.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>No saved payloads</p>
                <p className="text-sm mt-2">Generate and save payloads to see them here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedPayloads.map(item => (
                  <div 
                    key={item.id} 
                    className="bg-dark-800 rounded-md p-3 cursor-pointer hover:bg-dark-700"
                    onClick={() => {
                      setPayload(item.code)
                      setTechnique(item.technique)
                      setTarget(item.target)
                    }}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <span className="text-xs text-gray-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {item.technique} • {item.target}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <DebugConsole logs={logs} onClear={clearLogs} />
    </div>
  )
}

export default RedTeamPage