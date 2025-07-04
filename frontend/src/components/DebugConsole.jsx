import { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaTrash, FaDownload } from 'react-icons/fa'

const DebugConsole = ({ logs = [], onClear }) => {
  const [isOpen, setIsOpen] = useState(true)
  
  const getLogClass = (level) => {
    switch (level) {
      case 'error':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-500'
      case 'success':
        return 'text-green-500'
      case 'info':
        return 'text-blue-500'
      default:
        return 'text-gray-300'
    }
  }
  
  const downloadLogs = () => {
    const content = logs.map(log => 
      `[${new Date(log.timestamp).toISOString()}] [${log.level.toUpperCase()}] ${log.message}`
    ).join('\n')
    
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `debug-logs-${new Date().toISOString()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
  
  return (
    <div className="border border-dark-600 rounded-md overflow-hidden">
      <div 
        className="bg-dark-700 px-4 py-2 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <h3 className="font-medium">Debug Console</h3>
          <span className="ml-2 text-xs bg-dark-600 px-2 py-0.5 rounded-full">
            {logs.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {logs.length > 0 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClear()
                }}
                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-dark-600 focus:outline-none"
                title="Clear logs"
              >
                <FaTrash className="h-3 w-3" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  downloadLogs()
                }}
                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-dark-600 focus:outline-none"
                title="Download logs"
              >
                <FaDownload className="h-3 w-3" />
              </button>
            </>
          )}
          
          {isOpen ? (
            <FaChevronUp className="h-4 w-4" />
          ) : (
            <FaChevronDown className="h-4 w-4" />
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="bg-dark-800 max-h-64 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <div className="p-4 text-gray-400 text-center">No logs to display</div>
          ) : (
            <div className="p-2">
              {logs.map((log, index) => (
                <div key={index} className="py-1 border-b border-dark-700 last:border-0">
                  <div className="flex">
                    <span className="text-gray-500 mr-2">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`font-semibold ${getLogClass(log.level)}`}>
                      [{log.level.toUpperCase()}]
                    </span>
                    <span className="ml-2">{log.message}</span>
                  </div>
                  {log.details && (
                    <div className="ml-6 mt-1 text-gray-400 whitespace-pre-wrap">
                      {typeof log.details === 'object' 
                        ? JSON.stringify(log.details, null, 2)
                        : log.details
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DebugConsole