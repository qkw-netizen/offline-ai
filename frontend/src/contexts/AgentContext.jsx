import { createContext, useState, useContext } from 'react'

const AgentContext = createContext()

export const useAgent = () => useContext(AgentContext)

export const AgentProvider = ({ children }) => {
  const [agents, setAgents] = useState([
    { id: 'planner', name: 'PlannerAgent', description: 'Plans and breaks down complex tasks' },
    { id: 'code', name: 'CodeAgent', description: 'Generates production-grade code' },
    { id: 'redteam', name: 'RedTeamAgent', description: 'Creates security exploits and payloads' },
    { id: 'evaluator', name: 'EvaluatorAgent', description: 'Evaluates solutions and provides feedback' },
    { id: 'executor', name: 'ExecutorAgent', description: 'Executes plans and reports results' }
  ])
  
  const [activeAgent, setActiveAgent] = useState(agents[0])
  const [agentHistory, setAgentHistory] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  
  const executeAgent = async (task, context = {}, tools = []) => {
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: activeAgent.name,
          task,
          context,
          tools
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      // Add to history
      setAgentHistory(prev => [...prev, {
        id: Date.now().toString(),
        agent: activeAgent.name,
        task,
        result,
        timestamp: new Date().toISOString()
      }])
      
      return result
    } catch (error) {
      console.error('Error executing agent:', error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }
  
  const executeMultiAgentWorkflow = async (task, workflow, context = {}) => {
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/agents/multi-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task,
          workflow,
          context
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      // Add to history
      setAgentHistory(prev => [...prev, {
        id: Date.now().toString(),
        agent: 'Multi-Agent',
        task,
        result,
        timestamp: new Date().toISOString()
      }])
      
      return result
    } catch (error) {
      console.error('Error executing multi-agent workflow:', error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }
  
  const clearHistory = () => {
    setAgentHistory([])
  }
  
  return (
    <AgentContext.Provider value={{
      agents,
      activeAgent,
      setActiveAgent,
      agentHistory,
      isProcessing,
      executeAgent,
      executeMultiAgentWorkflow,
      clearHistory
    }}>
      {children}
    </AgentContext.Provider>
  )
}