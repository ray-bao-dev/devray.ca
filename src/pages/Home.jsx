import { useState, useEffect } from 'react'
import './Home.css'

// Stingray SVG
const StingraySvg = () => (
  <svg fill="#000000" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path 
      stroke="var(--main)" 
      strokeWidth="0.5" 
      fill="var(--bg)" 
      d="M13.1,33.92c0,1.06,.72,1.98,1.74,2.24l3.12,.79,3.01,6.04c.18,.36,.49,.63,.87,.76,.38,.13,.79,.1,1.16-.08,.29-.15,.53-.39,.67-.68l1.99-4.07,1.68,.43,3.5,19.66c.23,1.29,2.11,1.3,2.33,0l3.5-19.66,1.68-.43,1.99,4.06c.18,.36,.48,.63,.87,.76,.38,.13,.79,.1,1.15-.07,.3-.15,.54-.39,.68-.68l3.01-6.04,3.12-.79c1.03-.26,1.74-1.18,1.74-2.24v-14.63c0-.95-.45-1.86-1.21-2.44L33.42,4.48c-.84-.64-2-.64-2.84,0L14.31,16.86c-.76,.58-1.21,1.49-1.21,2.44v14.63Zm9.22,7.29l-1.8-3.6,3.16,.81-1.37,2.79Zm9.68,12.92l-2.53-14.23,1.29,.33c.41,.1,.82,.16,1.24,.16s.83-.05,1.24-.16l1.29-.33-2.53,14.23Zm.74-15.84c-.48,.12-1,.12-1.49,0l-4.69-1.2,5.44-11.09,5.43,11.09-4.69,1.2Zm8.94,2.92l-1.37-2.79,3.16-.81-1.8,3.6ZM15.1,19.3c0-.33,.16-.65,.42-.84L31.79,6.07c.12-.09,.29-.09,.42,0l16.27,12.38c.26,.2,.42,.52,.42,.85v14.63c0,.14-.1,.27-.24,.31l-9.25,2.36-5.62-11.46c-.24-.48-.64-.84-1.15-1.01-.51-.17-1.05-.14-1.53,.1-.4,.19-.72,.52-.92,.92l-5.62,11.46-9.25-2.36c-.14-.04-.24-.16-.24-.31v-14.63Z"
    />
  </svg>
)

// GitHub Icon
const GitHubIcon = () => (
  <svg className="github-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

function Home() {
  const [timestamp, setTimestamp] = useState('')

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
    const interval = setInterval(updateTimestamp, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="home-wrapper">
      <div className="home-content">
        <div className="svg-wrapper">
          <StingraySvg />
        </div>
        
        <div className="home-text">
          <p className="terminal-line">
            <span className="timestamp">{timestamp}</span> [raybao@devray]: ~/Ray_Bao/$ who
          </p>
          <h1>Hi, I'm Ray Bao</h1>
          <p className="bio">
            I'm a 3rd year student at <span className="highlight">McGill University</span>, majoring 
            in Computer Science - Artificial Intelligence with a minor in Economics. 
            I specialize in full-stack web development with a focus on back-end scripting. 
            Currently seeking internship or full-time opportunities in software development!
          </p>
          <div className="button-container">
            <a href="https://github.com/ray-bao-mcgill" className="button" target="_blank" rel="noopener noreferrer">
              <GitHubIcon />
              GitHub
            </a>
            <a href="/resume/resume.pdf" className="button" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" />
              Resume
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
