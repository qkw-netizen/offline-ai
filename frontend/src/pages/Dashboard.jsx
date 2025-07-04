import { useState, useEffect } from 'react'
import { FaRobot, FaMemory, FaCode, FaShieldAlt } from 'react-icons/fa'
import { useAgent } from '../contexts/AgentContext'
import { useMemory } from '../contexts/MemoryContext'
import DebugConsole from '../components/DebugConsole'

const Dashboard = () => {
  const { agentHistory } = useAgent()
  const { memories } = useMemory()
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState({
    totalAgentCalls: 0,
    totalMemories: 0,
    codeGenerated: 0,
    redTeamPayloads: 0
  })
  
  useEffect(() => {
    // Simulate fetching stats
    setStats({
      totalAgentCalls: agentHistory.length,
      totalMemories: memories.length,
      codeGenerated: agentHistory.filter(h => h.agent === 'CodeAgent').length,
      redTeamPayloads: agentHistory.filter(h => h.agent === 'RedTeamAgent').length
    })
    
    // Simulate logs
    setLogs([
      {
        level: 'info',
        message: 'System initialized',
        timestamp: new Date().toISOString(),
        details: null
      },
      {
        level: 'info',
        message: 'Connected to Ollama API',
        timestamp: new Date(Date.now() - 1000).toISOString(),
        details: null
      },
      {
        level: 'info',
        message: 'Memory system initialized',
        timestamp: new Date(Date.now() - 2000).toISOString(),
        details: null
      }
    ])
  }, [agentHistory, memories])
  
  const clearLogs = () => {
    setLogs([])
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-700 text-white">
              <FaRobot className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Agent Calls</h2>
              <p className="text-2xl font-bold">{stats.totalAgentCalls}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-700 text-white">
              <FaMemory className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Memories</h2>
              <p className="text-2xl font-bold">{stats.totalMemories}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-700 text-white">
              <FaCode className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Code Generated</h2>
              <p className="text-2xl font-bold">{stats.codeGenerated}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-danger-700 text-white">
              <FaShieldAlt className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Red Team Payloads</h2>
              <p className="text-2xl font-bold">{stats.redTeamPayloads}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
          <h2 className="text-lg font-semibold mb-4">Recent Agent Activity</h2>
          
          {agentHistory.length === 0 ? (
            <p className="text-gray-400">No recent agent activity</p>
          ) : (
            <div className="space-y-3">
              {agentHistory.slice(0, 5).map((item, index) => (
                <div key={index} className="border-b border-dark-600 pb-3 last:border-0">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.agent}</span>
                    <span className="text-sm text-gray-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 truncate">{item.task}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
          <h2 className="text-lg font-semibold mb-4">Recent Memories</h2>
          
          {memories.length === 0 ? (
            <p className="text-gray-400">No memories stored</p>
          ) : (
            <div className="space-y-3">
              {memories.slice(0, 5).map((item, index) => (
                <div key={index} className="border-b border-dark-600 pb-3 last:border-0">
                  <div className="flex justify-between">
                    <span className="font-medium">Memory {item.id.slice(0, 8)}</span>
                    <span className="text-sm text-gray-400">
                      {item.metadata?.timestamp 
                        ? new Date(item.metadata.timestamp).toLocaleString()
                        : 'No timestamp'
                      }
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 truncate">{item.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <DebugConsole logs={logs} onClear={clearLogs} />
    </div>
  )
}

export default Dashboard