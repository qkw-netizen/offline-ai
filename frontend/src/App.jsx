import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import AgentPage from './pages/AgentPage'
import RedTeamPage from './pages/RedTeamPage'
import SettingsPage from './pages/SettingsPage'
import { AgentProvider } from './contexts/AgentContext'
import { MemoryProvider } from './contexts/MemoryContext'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [ollamaStatus, setOllamaStatus] = useState('checking')

  useEffect(() => {
    // Check if Ollama is running
    const checkOllama = async () => {
      try {
        const response = await fetch('/api/ollama/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-coder:1.3b',
            prompt: 'Hello',
            stream: false
          }),
        })
        
        if (response.ok) {
          setOllamaStatus('connected')
        } else {
          setOllamaStatus('error')
        }
      } catch (error) {
        console.error('Error checking Ollama status:', error)
        setOllamaStatus('error')
      }
    }
    
    checkOllama()
  }, [])

  return (
    <ThemeProvider>
      <AgentProvider>
        <MemoryProvider>
          <div className="flex h-screen bg-dark-800 text-white">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header 
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
                ollamaStatus={ollamaStatus}
              />
              
              <main className="flex-1 overflow-y-auto p-4 bg-dark-900">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/agent/:role?" element={<AgentPage />} />
                  <Route path="/redteam" element={<RedTeamPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        </MemoryProvider>
      </AgentProvider>
    </ThemeProvider>
  )
}

export default App