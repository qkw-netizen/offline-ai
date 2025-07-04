import { createContext, useState, useContext } from 'react'

const MemoryContext = createContext()

export const useMemory = () => useContext(MemoryContext)

export const MemoryProvider = ({ children }) => {
  const [memories, setMemories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  const storeMemory = async (content, metadata = {}) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/memory/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          metadata
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      // Refresh memories
      await queryMemories()
      
      return result
    } catch (error) {
      console.error('Error storing memory:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  const queryMemories = async (query = '', k = 10, filterMetadata = null) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/memory/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query || 'all',
          k,
          filter_metadata: filterMetadata
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      
      const result = await response.json()
      setMemories(result.items)
      
      return result.items
    } catch (error) {
      console.error('Error querying memories:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  const clearMemories = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/memory/clear', {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      
      setMemories([])
      
      return await response.json()
    } catch (error) {
      console.error('Error clearing memories:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <MemoryContext.Provider value={{
      memories,
      isLoading,
      storeMemory,
      queryMemories,
      clearMemories
    }}>
      {children}
    </MemoryContext.Provider>
  )
}