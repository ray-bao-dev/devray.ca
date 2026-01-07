import { useState, useEffect } from 'react'
import './Projects.css'

function Projects() {
  const [timestamp, setTimestamp] = useState('')

  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date()
      let hours = now.getHours()
      const minutes = now.getMinutes()
      hours = hours % 12
      hours = hours ? hours : 12
      const minutesPadded = minutes < 10 ? '0' + minutes : minutes
      setTimestamp(`${hours}:${minutesPadded}`)
    }
    
    updateTimestamp()
    const interval = setInterval(updateTimestamp, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="projects-wrapper">
      <div className="projects-header">
        <p>
          <span className="timestamp">{timestamp}</span>
          <span className="command"> [raybao@devray]: ~/Ray_Bao/$ cd projects</span>
        </p>
        <div className="header-title">
          <h1>past projects</h1>
        </div>
      </div>
      <div className="projects-content">
        {/* Add your projects here */}
        <p className="placeholder-text">
          Projects coming soon...
        </p>
      </div>
    </div>
  )
}

export default Projects

