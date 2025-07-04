import { useState, useRef, useEffect } from 'react'
import { FaPaperPlane, FaRobot, FaUser, FaTrash } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import { useAgent } from '../contexts/AgentContext'

const ChatInterface = () => {
  const { activeAgent, executeAgent, isProcessing } = useAgent()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!input.trim() || isProcessing) return
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    
    try {
      // Add loading message
      const loadingId = Date.now().toString()
      setMessages(prev => [...prev, {
        id: loadingId,
        role: 'assistant',
        content: 'Thinking...',
        loading: true,
        timestamp: new Date().toISOString()
      }])
      
      // Execute agent
      const result = await executeAgent(input)
      
      // Replace loading message with actual response
      setMessages(prev => prev.map(msg => 
        msg.id === loadingId 
          ? {
              id: loadingId,
              role: 'assistant',
              content: result.result,
              agentRole: activeAgent.name,
              timestamp: new Date().toISOString()
            }
          : msg
      ))
    } catch (error) {
      console.error('Error executing agent:', error)
      
      // Replace loading message with error
      setMessages(prev => prev.map(msg => 
        msg.loading 
          ? {
              id: msg.id,
              role: 'assistant',
              content: `Error: ${error.message}`,
              error: true,
              timestamp: new Date().toISOString()
            }
          : msg
      ))
    }
  }
  
  const clearChat = () => {
    setMessages([])
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-dark-700 border-b border-dark-600">
        <div className="flex items-center">
          <FaRobot className="h-5 w-5 text-secondary-500" />
          <h2 className="ml-2 font-medium">{activeAgent.name}</h2>
        </div>
        
        <button
          onClick={clearChat}
          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-dark-600 focus:outline-none"
          title="Clear chat"
        >
          <FaTrash className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaRobot className="h-12 w-12 mb-4" />
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Start a conversation with {activeAgent.name}</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3/4 rounded-lg px-4 py-2 ${
                  message.role === 'user' 
                    ? 'bg-primary-700 text-white' 
                    : message.error 
                      ? 'bg-danger-700 text-white' 
                      : 'bg-dark-700 text-white'
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.role === 'user' ? (
                    <>
                      <span className="font-medium">You</span>
                      <FaUser className="h-3 w-3 ml-2" />
                    </>
                  ) : (
                    <>
                      <span className="font-medium">{message.agentRole || activeAgent.name}</span>
                      <FaRobot className="h-3 w-3 ml-2" />
                    </>
                  )}
                </div>
                
                {message.loading ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-dark-600">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${activeAgent.name}...`}
            className="flex-1 bg-dark-700 border border-dark-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isProcessing}
          />
          
          <button
            type="submit"
            className={`px-4 py-2 rounded-md bg-primary-600 text-white focus:outline-none ${
              isProcessing || !input.trim() 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-primary-700'
            }`}
            disabled={isProcessing || !input.trim()}
          >
            <FaPaperPlane className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface