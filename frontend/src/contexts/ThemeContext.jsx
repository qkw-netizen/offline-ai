import { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true)
  
  useEffect(() => {
    // Check if user has a preference stored
    const storedPreference = localStorage.getItem('darkMode')
    if (storedPreference !== null) {
      setDarkMode(storedPreference === 'true')
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(prefersDark)
    }
  }, [])
  
  const toggleDarkMode = () => {
    const newValue = !darkMode
    setDarkMode(newValue)
    localStorage.setItem('darkMode', newValue.toString())
  }
  
  return (
    <ThemeContext.Provider value={{
      darkMode,
      toggleDarkMode
    }}>
      {children}
    </ThemeContext.Provider>
  )
}