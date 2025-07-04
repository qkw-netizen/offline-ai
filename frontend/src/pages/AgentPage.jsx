import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaRobot, FaCode, FaPlay } from 'react-icons/fa'
import { useAgent } from '../contexts/AgentContext'
import ChatInterface from '../components/ChatInterface'
import CodeEditor from '../components/CodeEditor'
import DebugConsole from '../components/DebugConsole'

const AgentPage = () => {
  const { role } = useParams()
  const navigate = useNavigate()
  const { agents, activeAgent, setActiveAgent, executeAgent } = useAgent()
  const [logs, setLogs] = useState([])
  const [code, setCode] = useState('')
  const [codeLanguage, setCodeLanguage] = useState('javascript')
  const [codeOutput, setCodeOutput] = useState('')
  
  useEffect(() => {
    // If role is provided in URL, set the active agent
    if (role) {
      const agent = agents.find(a => a.id === role)
      if (agent) {
        setActiveAgent(agent)
      } else {
        navigate('/agent')
      }
    }
  }, [role, agents, setActiveAgent, navigate])
  
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
  
  const executeCode = async () => {
    if (!code.trim()) return
    
    addLog('info', 'Executing code in sandbox...')
    setCodeOutput('')
    
    try {
      // Simulate code execution in sandbox
      setTimeout(() => {
        if (codeLanguage === 'javascript') {
          try {
            // Create a sandbox function to evaluate the code
            const sandbox = new Function(`
              try {
                // Capture console.log output
                const logs = [];
                const originalConsoleLog = console.log;
                console.log = (...args) => {
                  logs.push(args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                  ).join(' '));
                  originalConsoleLog(...args);
                };
                
                ${code}
                
                return { success: true, logs };
              } catch (error) {
                return { success: false, error: error.message };
              }
            `)
            
            const result = sandbox()
            
            if (result.success) {
              setCodeOutput(result.logs.join('\\n'))
              addLog('success', 'Code executed successfully', { output: result.logs })
            } else {
              setCodeOutput(`Error: ${result.error}`)
              addLog('error', 'Code execution failed', { error: result.error })
            }
          } catch (error) {
            setCodeOutput(`Error: ${error.message}`)
            addLog('error', 'Code execution failed', { error: error.message })
          }
        } else {
          // For non-JavaScript code, show a message that execution is not supported
          setCodeOutput('Code execution is only supported for JavaScript in the browser sandbox.')
          addLog('warning', 'Code execution not supported for this language')
        }
      }, 1000)
    } catch (error) {
      setCodeOutput(`Error: ${error.message}`)
      addLog('error', 'Code execution failed', { error: error.message })
    }
  }
  
  const generateCode = async () => {
    addLog('info', 'Generating code with CodeAgent...')
    
    try {
      const result = await executeAgent('Generate a function that sorts an array of objects by a specified property', {
        language: codeLanguage
      })
      
      setCode(result.result)
      addLog('success', 'Code generated successfully')
    } catch (error) {
      addLog('error', 'Code generation failed', { error: error.message })
    }
  }
  
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaRobot className="h-6 w-6 text-secondary-500" />
          <h1 className="text-2xl font-bold ml-2">{activeAgent.name}</h1>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={generateCode}
            className="flex items-center px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 focus:outline-none"
          >
            <FaCode className="mr-2 h-4 w-4" />
            Generate Code
          </button>
        </div>
      </div>
      
      <p className="text-gray-400">{activeAgent.description}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col h-full">
          <ChatInterface />
        </div>
        
        <div className="flex flex-col h-full space-y-4">
          <div className="flex-1">
            <CodeEditor
              code={code}
              language={codeLanguage}
              onChange={setCode}
              onExecute={executeCode}
            />
          </div>
          
          <div className="h-1/3">
            <div className="bg-dark-700 border border-dark-600 rounded-md h-full overflow-hidden">
              <div className="bg-dark-800 px-4 py-2 flex items-center justify-between">
                <h3 className="font-medium">Output</h3>
                <div className="flex space-x-2">
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    className="bg-dark-600 text-white text-sm rounded-md px-2 py-1 focus:outline-none"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="bash">Bash</option>
                  </select>
                  
                  <button
                    onClick={executeCode}
                    className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-dark-600 focus:outline-none"
                    title="Execute code"
                  >
                    <FaPlay className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 font-mono text-sm h-full overflow-y-auto whitespace-pre-wrap">
                {codeOutput || 'No output yet. Execute code to see results.'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <DebugConsole logs={logs} onClear={clearLogs} />
    </div>
  )
}

export default AgentPage