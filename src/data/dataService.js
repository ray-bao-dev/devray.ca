// Cache for loaded data
let projectsCache = null
let profileCache = null

// Load projects data
export const loadProjects = async () => {
  if (projectsCache) return projectsCache
  
  try {
    const response = await fetch('/data/projects.json')
    projectsCache = await response.json()
    return projectsCache
  } catch (error) {
    console.error('Failed to load projects:', error)
    return { hackathon: [], personal: [] }
  }
}

// Load profile data
export const loadProfile = async () => {
  if (profileCache) return profileCache
  
  try {
    const response = await fetch('/data/profile.json')
    profileCache = await response.json()
    return profileCache
  } catch (error) {
    console.error('Failed to load profile:', error)
    return null
  }
}

// Get all projects flat
export const getAllProjects = async () => {
  const data = await loadProjects()
  return [...data.hackathon, ...data.personal]
}

// Get project by ID
export const getProjectById = async (id) => {
  const projects = await getAllProjects()
  return projects.find(p => p.id === id)
}

// Format project for terminal display
export const formatProjectForTerminal = (project, isHackathon = false) => {
  const lines = []
  const width = 44
  const border = '═'.repeat(width)
  
  lines.push(`╔${border}╗`)
  lines.push(`║  ${project.title}`.padEnd(width + 1) + '║')
  
  if (isHackathon && project.award) {
    lines.push(`║  ${project.event}`.padEnd(width + 1) + '║')
  }
  
  lines.push(`╚${border}╝`)
  lines.push('')
  
  if (isHackathon && project.award) {
    lines.push(`Award: ${project.award}`)
  }
  
  if (project.date) {
    lines.push(`Date: ${project.date}`)
  }
  lines.push('')
  
  lines.push('Description:')
  lines.push('────────────')
  
  // Word wrap description
  const words = project.description.split(' ')
  let currentLine = ''
  for (const word of words) {
    if ((currentLine + ' ' + word).length > 44) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = currentLine ? currentLine + ' ' + word : word
    }
  }
  if (currentLine) lines.push(currentLine)
  
  lines.push('')
  lines.push('Tech Stack:')
  lines.push(`  ${project.tech.join(', ')}`)
  
  if (project.github || project.live || project.devpost) {
    lines.push('')
    if (project.github) lines.push(`GitHub: ${project.github}`)
    if (project.live) lines.push(`Live: ${project.live}`)
    if (project.devpost) lines.push(`Devpost: ${project.devpost}`)
  }
  
  return lines.join('\n')
}

// Format profile for terminal display
export const formatProfileForTerminal = (profile) => {
  const lines = []
  const width = 44
  const border = '═'.repeat(width)
  
  lines.push(`╔${border}╗`)
  lines.push(`║${profile.name.toUpperCase().padStart(Math.floor((width + profile.name.length) / 2)).padEnd(width)}║`)
  lines.push(`║${profile.title.padStart(Math.floor((width + profile.title.length) / 2)).padEnd(width)}║`)
  lines.push(`╚${border}╝`)
  lines.push('')
  lines.push(`Location: ${profile.location}`)
  lines.push(`Education: ${profile.education.degree}`)
  lines.push(`           @ ${profile.education.school}`)
  lines.push(`           Minor: ${profile.education.minor}`)
  lines.push('')
  
  // Word wrap bio
  const words = profile.bio.split(' ')
  let currentLine = ''
  for (const word of words) {
    if ((currentLine + ' ' + word).length > 44) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = currentLine ? currentLine + ' ' + word : word
    }
  }
  if (currentLine) lines.push(currentLine)
  
  lines.push('')
  lines.push(`Languages: ${profile.languages.join(', ')}`)
  lines.push('')
  lines.push('━'.repeat(44))
  lines.push("Type 'cat resume.pdf' for resume")
  lines.push("Type 'cd projects' to see my work")
  lines.push("Type 'cd contact' to get in touch")
  lines.push('━'.repeat(44))
  
  return lines.join('\n')
}

// Format skills for terminal
export const formatSkillsForTerminal = (skills, category) => {
  const lines = []
  
  if (category === 'languages') {
    lines.push('Programming Languages')
    lines.push('═'.repeat(21))
    lines.push('')
    
    const levelBars = {
      'Expert': '██████████',
      'Advanced': '████████░░',
      'Proficient': '██████░░░░',
      'Familiar': '████░░░░░░'
    }
    
    skills.languages.forEach(lang => {
      const bar = levelBars[lang.level] || '████░░░░░░'
      lines.push(`> ${lang.name.padEnd(10)} ${bar} ${lang.level}`)
    })
  } else if (category === 'frameworks') {
    lines.push('Frameworks & Libraries')
    lines.push('═'.repeat(22))
    lines.push('')
    
    Object.entries(skills.frameworks).forEach(([group, items]) => {
      lines.push(`${group}:`)
      lines.push(`  ${items.join(', ')}`)
      lines.push('')
    })
  } else if (category === 'tools') {
    lines.push('Tools & Technologies')
    lines.push('═'.repeat(20))
    lines.push('')
    
    Object.entries(skills.tools).forEach(([group, items]) => {
      lines.push(`${group}:`)
      lines.push(`  ${items.join(', ')}`)
      lines.push('')
    })
  }
  
  return lines.join('\n').trimEnd()
}

// Format contact for terminal
export const formatContactForTerminal = (contact, type) => {
  const lines = []
  
  switch (type) {
    case 'email':
      lines.push('Email')
      lines.push('═════')
      lines.push(contact.email)
      lines.push('')
      lines.push('Feel free to reach out for:')
      lines.push('  > Job opportunities')
      lines.push('  > Collaboration on projects')
      lines.push('  > General inquiries')
      lines.push('')
      lines.push('I typically respond within 24-48 hours!')
      break
    case 'linkedin':
      lines.push('LinkedIn')
      lines.push('════════')
      lines.push(contact.linkedin)
      lines.push('')
      lines.push('Connect with me for:')
      lines.push('  > Professional networking')
      lines.push('  > Career opportunities')
      lines.push('  > Industry insights')
      break
    case 'github':
      lines.push('GitHub')
      lines.push('══════')
      lines.push(contact.github)
      lines.push('')
      lines.push('Check out my:')
      lines.push('  > Open source projects')
      lines.push('  > Hackathon submissions')
      lines.push('  > Code contributions')
      break
    case 'phone':
      lines.push('Phone')
      lines.push('═════')
      lines.push(contact.phone)
      lines.push('')
      lines.push('Available for calls regarding:')
      lines.push('  > Job opportunities')
      lines.push('  > Project discussions')
      lines.push('  > Technical consultations')
      break
  }
  
  return lines.join('\n')
}

// Format experience/job for terminal
export const formatExperienceForTerminal = (job) => {
  const lines = []
  const width = 44
  const border = '═'.repeat(width)
  
  lines.push(`╔${border}╗`)
  lines.push(`║  ${job.title}`.padEnd(width + 1) + '║')
  lines.push(`║  ${job.company} | ${job.location}`.padEnd(width + 1) + '║')
  lines.push(`╚${border}╝`)
  lines.push('')
  lines.push(`Duration: ${job.startDate} - ${job.endDate}${job.current ? ' (Current)' : ''}`)
  lines.push('')
  lines.push('Description:')
  lines.push('────────────')
  
  // Word wrap description
  const descWords = job.description.split(' ')
  let descLine = ''
  for (const word of descWords) {
    if ((descLine + ' ' + word).length > 44) {
      lines.push(descLine)
      descLine = word
    } else {
      descLine = descLine ? descLine + ' ' + word : word
    }
  }
  if (descLine) lines.push(descLine)
  
  lines.push('')
  lines.push('Key Contributions:')
  job.highlights.forEach(h => {
    const words = h.split(' ')
    let currentLine = '  > '
    for (const word of words) {
      if ((currentLine + ' ' + word).length > 44) {
        lines.push(currentLine)
        currentLine = '    ' + word
      } else {
        currentLine = currentLine + (currentLine === '  > ' ? '' : ' ') + word
      }
    }
    if (currentLine.trim()) lines.push(currentLine)
  })
  lines.push('')
  lines.push('Tech Used:')
  lines.push(`  ${job.tech.join(', ')}`)
  
  return lines.join('\n')
}

