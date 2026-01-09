import { useEffect } from 'react'
import useTerminal from './useTerminal'
import './Terminal.css'

const Terminal = () => {
  const {
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
  } = useTerminal()

  // Global keyboard shortcut to toggle terminal
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Ctrl + ` or Ctrl + / to toggle terminal
      if (e.ctrlKey && (e.key === '`' || e.key === '/')) {
        e.preventDefault()
        toggleTerminal()
      }
    }
    
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [toggleTerminal])

  const renderHistoryEntry = (entry, index) => {
    switch (entry.type) {
      case 'command':
        return (
          <div key={index} className="terminal-line">
            <span className="terminal-prompt">{entry.prompt}</span>
            <span className="terminal-command">{entry.content}</span>
          </div>
        )
      case 'system':
        return (
          <div key={index} className="terminal-line terminal-system">
            {entry.content}
          </div>
        )
      case 'error':
        return (
          <div key={index} className="terminal-line terminal-error">
            {entry.content}
          </div>
        )
      case 'success':
        return (
          <div key={index} className="terminal-line terminal-success">
            {entry.content}
          </div>
        )
      default:
        return (
          <div key={index} className="terminal-line terminal-output">
            {entry.content.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )
    }
  }

  return (
    <>
      {/* Floating Terminal Button */}
      <button 
        className={`terminal-trigger ${isOpen ? 'terminal-trigger--hidden' : ''}`}
        onClick={openTerminal}
        title="Open Terminal (Ctrl + `)"
        aria-label="Open Terminal"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="4,17 10,11 4,5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      </button>

      {/* Terminal Panel */}
      <div className={`terminal-panel ${isOpen ? 'terminal-panel--open' : ''}`}>
        {/* Terminal Header */}
        <div className="terminal-header">
          <div className="terminal-header-left">
            <span className="terminal-title-icon">▸</span>
            <span className="terminal-title">Terminal</span>
          </div>
          <div className="terminal-header-path">
            {currentDir}
          </div>
          <div className="terminal-header-actions">
            <button 
              className="terminal-action-btn"
              onClick={closeTerminal}
              title="Close (Esc)"
              aria-label="Close terminal"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        <div 
          className="terminal-content" 
          ref={outputRef}
          onClick={focusInput}
        >
          <div className="terminal-history">
            {history.map(renderHistoryEntry)}
          </div>

          {/* Input Line */}
          <div className="terminal-input-line">
            <span className="terminal-prompt">
              Ray_Bao@devray:{currentDir}$
            </span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="terminal-footer">
          <span className="terminal-hint">
            Tab: autocomplete • ↑↓: history • Esc: close • Ctrl+L: clear
          </span>
        </div>
      </div>
    </>
  )
}

export default Terminal
