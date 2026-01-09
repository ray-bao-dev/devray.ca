import { useState, useEffect } from 'react'
import { loadProfile } from '../data/dataService'
import './Career.css'

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z"/>
  </svg>
)

function Career() {
  const [timestamp, setTimestamp] = useState('')
  const [experience, setExperience] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

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
    const fetchProfile = async () => {
      const profile = await loadProfile()
      if (profile?.experience) {
        // Sort by date (most recent first)
        const sorted = [...profile.experience].sort((a, b) => {
          const dateA = new Date(a.startDate)
          const dateB = new Date(b.startDate)
          return dateB - dateA
        })
        setExperience(sorted)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (loading) {
    return (
      <div className="career-wrapper">
        <div className="career-header">
          <p className="terminal-line">
            <span className="timestamp">{timestamp}</span> [raybao@devray]: ~/Ray_Bao/$ cd career
          </p>
          <h1>career</h1>
        </div>
        <p className="loading-text">Loading experience...</p>
      </div>
    )
  }

  return (
    <div className="career-wrapper">
      <div className="career-header">
        <p className="terminal-line">
          <span className="timestamp">{timestamp}</span> [raybao@devray]: ~/Ray_Bao/$ cd career
        </p>
        <h1>career</h1>
        <p className="career-subtitle">Click on a role to see details</p>
      </div>

      <div className="timeline">
        {experience.map((job, index) => (
          <div 
            key={job.id} 
            className={`timeline-item ${index % 2 === 0 ? 'right' : 'left'} ${expandedId === job.id ? 'expanded' : ''} ${job.current ? 'current' : ''}`}
            onClick={() => toggleExpand(job.id)}
          >
            <div className="timeline-marker">
              <div className="marker-dot" />
              {index < experience.length - 1 && <div className="marker-line" />}
            </div>
            
            <div className="timeline-content">
              <div className="timeline-header">
                <div className="timeline-title-section">
                  <h3 className="job-title">{job.title}</h3>
                  <span className="job-company">{job.company}</span>
                </div>
                <div className="timeline-meta">
                  <span className="job-date">
                    {job.startDate} - {job.endDate}
                  </span>
                  {job.current && <span className="current-badge">Current</span>}
                </div>
              </div>
              
              <p className="job-location">{job.location}</p>
              <p className="job-description">{job.description}</p>

              <div className={`job-details ${expandedId === job.id ? 'show' : ''}`}>
                <div className="job-highlights">
                  <h4>Key Contributions</h4>
                  <ul>
                    {job.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="job-tech">
                  {job.tech.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>

              <span className="expand-hint">
                {expandedId === job.id ? 'Click to collapse' : 'Click to expand'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Career

