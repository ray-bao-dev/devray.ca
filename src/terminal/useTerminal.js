import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { executeCommand, getAutocompleteSuggestions } from './commands'
import { routeToDirectory, buildFileSystem } from './fileSystem'

export const useTerminal = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isOpen, setIsOpen] = useState(false)
  const [currentDir, setCurrentDir] = useState('/home/Ray_Bao')
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([
    { type: 'system', content: 'Welcome to devray.ca! Type "help" for commands, "whoami" to learn about me, or "tree" to explore.' }
  ])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isInitialized, setIsInitialized] = useState(false)
  
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  // Initialize file system when terminal first opens
  useEffect(() => {
    if (isOpen && !isInitialized) {
      buildFileSystem().then(() => {
        setIsInitialized(true)
      })
    }
  }, [isOpen, isInitialized])

  // Sync terminal directory with current route
  useEffect(() => {
    const dir = routeToDirectory[location.pathname]
    if (dir && dir !== currentDir) {
      setCurrentDir(dir)
    }
  }, [location.pathname])

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const openTerminal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeTerminal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleTerminal = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const processCommand = useCallback((cmd) => {
    if (!cmd.trim()) return

    // Add command to display history
    const newEntry = {
      type: 'command',
      prompt: `Ray_Bao@devray:${currentDir}$`,
      content: cmd
    }

    // Execute the command
    const result = executeCommand(cmd, { currentDir })

    // Handle clear command
    if (result.output === '__CLEAR__') {
      setHistory([])
      setCommandHistory(prev => [...prev, cmd])
      setHistoryIndex(-1)
      return
    }

    // Handle navigation
    if (result.navigate) {
      navigate(result.navigate)
    }

    // Handle URL opening (for resume)
    if (result.openUrl) {
      window.open(result.openUrl, '_blank')
    }

    // Update directory
    if (result.newDir !== currentDir) {
      setCurrentDir(result.newDir)
    }

    // Add to history
    const entries = [newEntry]
    if (result.output) {
      entries.push({
        type: result.type || 'output',
        content: result.output
      })
    }

    setHistory(prev => [...prev, ...entries])
    setCommandHistory(prev => [...prev, cmd])
    setHistoryIndex(-1)
  }, [currentDir, navigate])

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value)
  }, [])

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'Enter':
        processCommand(input)
        setInput('')
        break
        
      case 'Tab':
        e.preventDefault()
        handleTabCompletion()
        break
        
      case 'ArrowUp':
        e.preventDefault()
        if (commandHistory.length > 0) {
          const newIndex = historyIndex < commandHistory.length - 1 
            ? historyIndex + 1 
            : historyIndex
          setHistoryIndex(newIndex)
          setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
        }
        break
        
      case 'ArrowDown':
        e.preventDefault()
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          setHistoryIndex(newIndex)
          setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
        } else if (historyIndex === 0) {
          setHistoryIndex(-1)
          setInput('')
        }
        break
        
      case 'Escape':
        closeTerminal()
        break
        
      case 'c':
        if (e.ctrlKey) {
          e.preventDefault()
          setInput('')
          setHistory(prev => [...prev, {
            type: 'command',
            prompt: `Ray_Bao@devray:${currentDir}$`,
            content: input + '^C'
          }])
        }
        break
        
      case 'l':
        if (e.ctrlKey) {
          e.preventDefault()
          clearHistory()
        }
        break
    }
  }, [input, commandHistory, historyIndex, currentDir, processCommand, closeTerminal, clearHistory])

  const handleTabCompletion = useCallback(() => {
    const suggestions = getAutocompleteSuggestions(input, currentDir)
    
    if (suggestions.length === 1) {
      // Single match - complete it
      const parts = input.split(' ')
      if (parts.length === 1) {
        setInput(suggestions[0])
      } else {
        parts[parts.length - 1] = suggestions[0]
        setInput(parts.join(' '))
      }
    } else if (suggestions.length > 1) {
      // Multiple matches - show them
      setHistory(prev => [...prev, {
        type: 'command',
        prompt: `Ray_Bao@devray:${currentDir}$`,
        content: input
      }, {
        type: 'output',
        content: suggestions.join('  ')
      }])
    }
  }, [input, currentDir])

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return {
    isOpen,
    currentDir,
    input,
    history,
    inputRef,
    outputRef,
    openTerminal,
    closeTerminal,
    toggleTerminal,
    handleInputChange,
    handleKeyDown,
    focusInput
  }
}

export default useTerminal
