import { FaBars, FaMoon, FaSun, FaCircle } from 'react-icons/fa'
import { useTheme } from '../contexts/ThemeContext'

const Header = ({ toggleSidebar, ollamaStatus }) => {
  const { darkMode, toggleDarkMode } = useTheme()
  
  const getStatusColor = () => {
    switch (ollamaStatus) {
      case 'connected':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-yellow-500'
    }
  }
  
  const getStatusText = () => {
    switch (ollamaStatus) {
      case 'connected':
        return 'Ollama Connected'
      case 'error':
        return 'Ollama Error'
      default:
        return 'Checking Ollama...'
    }
  }
  
  return (
    <header className="bg-dark-700 border-b border-dark-600 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-600 focus:outline-none"
        >
          <FaBars className="h-5 w-5" />
        </button>
        
        <h1 className="ml-4 text-xl font-semibold text-white">Offline AI System</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <FaCircle className={`h-3 w-3 ${getStatusColor()}`} />
          <span className="ml-2 text-sm">{getStatusText()}</span>
        </div>
        
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-600 focus:outline-none"
        >
          {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  )
}

export default Header