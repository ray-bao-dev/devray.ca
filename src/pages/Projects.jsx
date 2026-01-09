import { useState, useEffect } from 'react'
import { loadProjects } from '../data/dataService'
import './Projects.css'

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const ExternalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
  </svg>
)

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m5-4H7v2h10V2zm2 4H5c-1.1 0-2 .9-2 2v2c0 1.54.82 2.89 2 3.65v.35c0 1.1.9 2 2 2h3v2H8v2h8v-2h-2v-2h3c1.1 0 2-.9 2-2v-.35c1.18-.76 2-2.11 2-3.65V8c0-1.1-.9-2-2-2zM5 10V8h2v4c-1.1 0-2-.9-2-2zm14 0c0 1.1-.9 2-2 2V8h2v2z"/>
  </svg>
)

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <polyline points="16,18 22,12 16,6" />
    <polyline points="8,6 2,12 8,18" />
  </svg>
)

function Projects() {
  const [timestamp, setTimestamp] = useState('')
  const [hackathonProjects, setHackathonProjects] = useState([])
  const [personalProjects, setPersonalProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date()
      let hours = now.getHours()
      const minutes = now.getMinutes()
      hours = hours % 12 || 12
      const minutesPadded = minutes < 10 ? '0' + minutes : minutes
      setTimestamp(`${hours}:${minutesPadded}`)
    }
    updateTimestamp()
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await loadProjects()
      setHackathonProjects(data.hackathon || [])
      setPersonalProjects(data.personal || [])
      setLoading(false)
    }
    fetchProjects()
  }, [])

  const renderProjectCard = (project, isHackathon = false) => (
    <div className={`project-card ${isHackathon ? 'hackathon-card' : ''}`}>
      <div className="card-top">
        <div className="card-title-section">
          <h3>{project.title}</h3>
          {isHackathon && project.award && (
            <div className="award-badge">
              <TrophyIcon />
              <span>{project.award}</span>
            </div>
          )}
        </div>
        <div className="card-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label="Live">
              <ExternalIcon />
            </a>
          )}
          {project.devpost && (
            <a href={project.devpost} target="_blank" rel="noopener noreferrer" aria-label="Devpost">
              <ExternalIcon />
            </a>
          )}
        </div>
      </div>
      {isHackathon && (
        <div className="card-meta">
          <span className="award-name">{project.event}</span>
          <span className="project-date">{project.date}</span>
        </div>
      )}
      <p className="card-description">{project.description}</p>
      <ul className="card-tech">
        {project.tech.map((tech, i) => (
          <li key={i}>{tech}</li>
        ))}
      </ul>
    </div>
  )

  if (loading) {
    return (
      <div className="projects-wrapper">
        <div className="projects-header">
          <p className="terminal-line">
            <span className="timestamp">{timestamp}</span> [raybao@devray]: ~/Ray_Bao/$ cd projects
          </p>
          <h1>projects</h1>
        </div>
        <p className="loading-text">Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="projects-wrapper">
      <div className="projects-header">
        <p className="terminal-line">
          <span className="timestamp">{timestamp}</span> [raybao@devray]: ~/Ray_Bao/$ cd projects
        </p>
        <h1>projects</h1>
      </div>

      {/* Hackathon Section */}
      {hackathonProjects.length > 0 && (
        <section className="projects-section">
          <div className="section-header">
            <h2>
              <span className="section-icon"><TrophyIcon /></span>
              Hackathon Projects
            </h2>
            <p className="section-subtitle">{hackathonProjects.length} Award-Winning Projects</p>
          </div>
          <div className="projects-grid">
            {hackathonProjects.map((project) => (
              <div key={project.id}>
                {renderProjectCard(project, true)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Personal Section */}
      {personalProjects.length > 0 && (
        <section className="projects-section">
          <div className="section-header">
            <h2>
              <span className="section-icon"><CodeIcon /></span>
              Personal Projects
            </h2>
          </div>
          <div className="projects-grid">
            {personalProjects.map((project) => (
              <div key={project.id}>
                {renderProjectCard(project, false)}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Projects
