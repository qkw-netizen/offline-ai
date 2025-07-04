import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { FaPlay, FaCopy, FaDownload } from 'react-icons/fa'

const CodeEditor = ({ 
  code, 
  language = 'javascript', 
  onChange,
  readOnly = false,
  height = '400px',
  onExecute = null
}) => {
  const [theme, setTheme] = useState('vs-dark')
  const [copied, setCopied] = useState(false)
  
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
  }
  
  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([code], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `code.${language === 'python' ? 'py' : language === 'javascript' ? 'js' : language}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
  
  return (
    <div className="border border-dark-600 rounded-md overflow-hidden">
      <div className="bg-dark-700 px-4 py-2 flex items-center justify-between">
        <div className="text-sm font-medium">{language.toUpperCase()}</div>
        <div className="flex space-x-2">
          {onExecute && (
            <button
              onClick={onExecute}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-dark-600 focus:outline-none"
              title="Execute code"
            >
              <FaPlay className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-dark-600 focus:outline-none"
            title={copied ? 'Copied!' : 'Copy code'}
          >
            <FaCopy className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-dark-600 focus:outline-none"
            title="Download code"
          >
            <FaDownload className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <Editor
        height={height}
        language={language}
        value={code}
        theme={theme}
        onChange={onChange}
        options={{
          readOnly,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          tabSize: 2,
          wordWrap: 'on'
        }}
      />
    </div>
  )
}

export default CodeEditor