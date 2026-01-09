import {
  loadProjects,
  loadProfile,
  formatProjectForTerminal,
  formatProfileForTerminal,
  formatSkillsForTerminal,
  formatContactForTerminal,
  formatExperienceForTerminal
} from '../data/dataService'

// Cache for dynamic file system
let dynamicFileSystem = null
let dynamicFileContents = null

// Build file system structure dynamically from projects data
export const buildFileSystem = async () => {
  const projects = await loadProjects()
  const profile = await loadProfile()
  
  const fileSystem = {
    '/home/Ray_Bao': {
      type: 'directory',
      contents: ['about.txt', 'resume.pdf', 'skills', 'projects', 'career', 'contact']
    },
    '/home/Ray_Bao/about.txt': { type: 'file' },
    '/home/Ray_Bao/resume.pdf': { type: 'file' },
    
    // Skills directory
    '/home/Ray_Bao/skills': {
      type: 'directory',
      contents: ['languages.txt', 'frameworks.txt', 'tools.txt']
    },
    '/home/Ray_Bao/skills/languages.txt': { type: 'file' },
    '/home/Ray_Bao/skills/frameworks.txt': { type: 'file' },
    '/home/Ray_Bao/skills/tools.txt': { type: 'file' },
    
    // Projects directory
    '/home/Ray_Bao/projects': {
      type: 'directory',
      contents: ['hackathons', 'personal']
    },
    
    // Hackathon projects
    '/home/Ray_Bao/projects/hackathons': {
      type: 'directory',
      contents: projects.hackathon.map(p => `${p.id}.txt`)
    },
    
    // Personal projects
    '/home/Ray_Bao/projects/personal': {
      type: 'directory',
      contents: projects.personal.map(p => `${p.id}.txt`)
    },
    
    // Career directory
    '/home/Ray_Bao/career': {
      type: 'directory',
      contents: profile.experience.map(e => `${e.id}.txt`)
    },
    
    // Contact directory
    '/home/Ray_Bao/contact': {
      type: 'directory',
      contents: ['email.txt', 'linkedin.txt', 'github.txt', 'phone.txt']
    },
    '/home/Ray_Bao/contact/email.txt': { type: 'file' },
    '/home/Ray_Bao/contact/linkedin.txt': { type: 'file' },
    '/home/Ray_Bao/contact/github.txt': { type: 'file' },
    '/home/Ray_Bao/contact/phone.txt': { type: 'file' }
  }
  
  // Add hackathon project files
  projects.hackathon.forEach(p => {
    fileSystem[`/home/Ray_Bao/projects/hackathons/${p.id}.txt`] = { type: 'file' }
  })
  
  // Add personal project files
  projects.personal.forEach(p => {
    fileSystem[`/home/Ray_Bao/projects/personal/${p.id}.txt`] = { type: 'file' }
  })
  
  // Add career/experience files
  profile.experience.forEach(e => {
    fileSystem[`/home/Ray_Bao/career/${e.id}.txt`] = { type: 'file' }
  })
  
  // Build file contents
  const fileContents = {
    '/home/Ray_Bao/about.txt': formatProfileForTerminal(profile),
    '/home/Ray_Bao/resume.pdf': '__OPEN_RESUME__',
    '/home/Ray_Bao/skills/languages.txt': formatSkillsForTerminal(profile.skills, 'languages'),
    '/home/Ray_Bao/skills/frameworks.txt': formatSkillsForTerminal(profile.skills, 'frameworks'),
    '/home/Ray_Bao/skills/tools.txt': formatSkillsForTerminal(profile.skills, 'tools'),
    '/home/Ray_Bao/contact/email.txt': formatContactForTerminal(profile.contact, 'email'),
    '/home/Ray_Bao/contact/linkedin.txt': formatContactForTerminal(profile.contact, 'linkedin'),
    '/home/Ray_Bao/contact/github.txt': formatContactForTerminal(profile.contact, 'github'),
    '/home/Ray_Bao/contact/phone.txt': formatContactForTerminal(profile.contact, 'phone')
  }
  
  // Add hackathon project contents
  projects.hackathon.forEach(p => {
    fileContents[`/home/Ray_Bao/projects/hackathons/${p.id}.txt`] = formatProjectForTerminal(p, true)
  })
  
  // Add personal project contents
  projects.personal.forEach(p => {
    fileContents[`/home/Ray_Bao/projects/personal/${p.id}.txt`] = formatProjectForTerminal(p, false)
  })
  
  // Add career/experience contents
  profile.experience.forEach(e => {
    fileContents[`/home/Ray_Bao/career/${e.id}.txt`] = formatExperienceForTerminal(e)
  })
  
  dynamicFileSystem = fileSystem
  dynamicFileContents = fileContents
  
  return { fileSystem, fileContents }
}

// Initialize with default structure (will be populated dynamically)
export let fileSystem = {
  '/home/Ray_Bao': {
    type: 'directory',
    contents: ['about.txt', 'resume.pdf', 'skills', 'projects', 'career', 'contact']
  },
  '/home/Ray_Bao/about.txt': { type: 'file' },
  '/home/Ray_Bao/resume.pdf': { type: 'file' },
  '/home/Ray_Bao/skills': {
    type: 'directory',
    contents: ['languages.txt', 'frameworks.txt', 'tools.txt']
  },
  '/home/Ray_Bao/skills/languages.txt': { type: 'file' },
  '/home/Ray_Bao/skills/frameworks.txt': { type: 'file' },
  '/home/Ray_Bao/skills/tools.txt': { type: 'file' },
  '/home/Ray_Bao/projects': {
    type: 'directory',
    contents: ['hackathons', 'personal']
  },
  '/home/Ray_Bao/projects/hackathons': {
    type: 'directory',
    contents: []
  },
  '/home/Ray_Bao/projects/personal': {
    type: 'directory',
    contents: []
  },
  '/home/Ray_Bao/career': {
    type: 'directory',
    contents: []
  },
  '/home/Ray_Bao/contact': {
    type: 'directory',
    contents: ['email.txt', 'linkedin.txt', 'github.txt', 'phone.txt']
  },
  '/home/Ray_Bao/contact/email.txt': { type: 'file' },
  '/home/Ray_Bao/contact/linkedin.txt': { type: 'file' },
  '/home/Ray_Bao/contact/github.txt': { type: 'file' },
  '/home/Ray_Bao/contact/phone.txt': { type: 'file' }
}

export let fileContents = {
  '/home/Ray_Bao/about.txt': 'Loading...',
  '/home/Ray_Bao/resume.pdf': '__OPEN_RESUME__'
}

// Utility functions
export const normalizePath = (path) => {
  const parts = path.split('/').filter(Boolean)
  const stack = []
  for (const part of parts) {
    if (part === '..') {
      stack.pop()
    } else if (part !== '.') {
      stack.push(part)
    }
  }
  return '/' + stack.join('/')
}

export const getAbsolutePath = (currentDir, path) => {
  if (!path || path === '~') return '/home/Ray_Bao'
  if (path.startsWith('/')) return normalizePath(path)
  return normalizePath(`${currentDir}/${path}`)
}

export const isDirectory = (path) => {
  const fs = dynamicFileSystem || fileSystem
  return fs[path]?.type === 'directory'
}

export const isFile = (path) => {
  const fs = dynamicFileSystem || fileSystem
  return fs[path]?.type === 'file'
}

export const getDirectoryContents = (path) => {
  const fs = dynamicFileSystem || fileSystem
  if (isDirectory(path)) {
    return fs[path].contents
  }
  return null
}

export const getFileContent = (path) => {
  const fc = dynamicFileContents || fileContents
  return fc[path] || null
}

// Map directories to routes
export const directoryToRoute = {
  '/home/Ray_Bao': '/',
  '/home/Ray_Bao/projects': '/projects',
  '/home/Ray_Bao/career': '/career',
  '/home/Ray_Bao/contact': '/contact'
}

export const routeToDirectory = {
  '/': '/home/Ray_Bao',
  '/projects': '/home/Ray_Bao/projects',
  '/career': '/home/Ray_Bao/career',
  '/contact': '/home/Ray_Bao/contact'
}
