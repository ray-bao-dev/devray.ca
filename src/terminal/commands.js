import {
  getAbsolutePath,
  isDirectory,
  getDirectoryContents,
  getFileContent,
  directoryToRoute
} from './fileSystem'

// Command registry - easily add new commands
const commands = {}

// Register a command
export const registerCommand = (name, handler, description = '') => {
  commands[name] = { handler, description }
}

// Get all registered commands
export const getCommands = () => commands

// Execute a command
export const executeCommand = (input, context) => {
  const parts = input.trim().split(/\s+/)
  const cmd = parts[0].toLowerCase()
  const args = parts.slice(1)

  if (!cmd) return { output: '', newDir: context.currentDir }

  const command = commands[cmd]
  if (command) {
    return command.handler(args, context)
  }

  return {
    output: `Command not found: ${cmd}. Type 'help' for available commands.`,
    type: 'error',
    newDir: context.currentDir
  }
}

// ========== Built-in Commands ==========

// HELP command
registerCommand('help', (args, context) => {
  const helpText = `Available commands:
  help     - Show this help message
  ls       - List directory contents
  cd       - Change directory
  pwd      - Print working directory
  cat      - Display file contents
  tree     - Display directory tree
  clear    - Clear terminal
  whoami   - Display user information
  
Navigation:
  Use 'cd projects/hackathons' to see hackathon projects
  Use 'cd ~' or 'cd' to go home
  Use 'cd ..' to go up one directory

Tips:
  Press Tab for autocomplete
  Press Up/Down for command history
  Press Escape to close terminal`
  
  return { output: helpText, newDir: context.currentDir }
}, 'Show available commands')

// CLEAR command
registerCommand('clear', (args, context) => {
  return { output: '__CLEAR__', newDir: context.currentDir }
}, 'Clear terminal screen')

// PWD command
registerCommand('pwd', (args, context) => {
  return { output: context.currentDir, newDir: context.currentDir }
}, 'Print working directory')

// WHOAMI command
registerCommand('whoami', (args, context) => {
  const info = `Ray Bao
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Software Developer @ Ploomba
B.Sc. Computer Science (AI) @ McGill

3x Hackathon Winner:
   * McHacks 12 - Best Use of Generative AI
   * CodeJam 14 - Best Use of Hardware
   * HackThe6ix - Best Game Hack

Location: Montreal, Quebec
Languages: English, French, Mandarin`
  return { 
    output: info,
    newDir: context.currentDir 
  }
}, 'Display user information')

// LS command
registerCommand('ls', (args, context) => {
  const targetPath = args[0] 
    ? getAbsolutePath(context.currentDir, args[0])
    : context.currentDir

  const contents = getDirectoryContents(targetPath)
  
  if (contents) {
    const formatted = contents.map(item => {
      const itemPath = `${targetPath}/${item}`
      if (isDirectory(itemPath)) {
        return `[dir]  ${item}/`
      }
      return `[file] ${item}`
    }).join('\n')
    
    return { output: formatted, newDir: context.currentDir }
  }

  return {
    output: `ls: cannot access '${args[0] || targetPath}': No such file or directory`,
    type: 'error',
    newDir: context.currentDir
  }
}, 'List directory contents')

// CD command
registerCommand('cd', (args, context) => {
  const targetPath = getAbsolutePath(context.currentDir, args[0])

  if (isDirectory(targetPath)) {
    // Check if there's a route for this directory
    const route = directoryToRoute[targetPath]
    
    return {
      output: '',
      newDir: targetPath,
      navigate: route || null
    }
  }

  return {
    output: `cd: ${args[0] || targetPath}: No such directory`,
    type: 'error',
    newDir: context.currentDir
  }
}, 'Change directory')

// CAT command
registerCommand('cat', (args, context) => {
  if (!args[0]) {
    return {
      output: 'cat: missing file operand',
      type: 'error',
      newDir: context.currentDir
    }
  }

  const filePath = getAbsolutePath(context.currentDir, args[0])
  const content = getFileContent(filePath)

  if (content === '__OPEN_RESUME__') {
    return {
      output: 'Opening resume in new tab...',
      type: 'success',
      openUrl: '/resume/resume.pdf',
      newDir: context.currentDir
    }
  }

  if (content) {
    return { output: content, newDir: context.currentDir }
  }

  if (isDirectory(filePath)) {
    return {
      output: `cat: ${args[0]}: Is a directory`,
      type: 'error',
      newDir: context.currentDir
    }
  }

  return {
    output: `cat: ${args[0]}: No such file or directory`,
    type: 'error',
    newDir: context.currentDir
  }
}, 'Display file contents')

// TREE command - recursively display directory structure
registerCommand('tree', (args, context) => {
  const targetPath = args[0] 
    ? getAbsolutePath(context.currentDir, args[0])
    : context.currentDir

  if (!isDirectory(targetPath)) {
    return {
      output: `tree: '${args[0] || targetPath}': Not a directory`,
      type: 'error',
      newDir: context.currentDir
    }
  }

  const buildTree = (path, prefix = '', isLast = true) => {
    const name = path.split('/').pop() || path
    const contents = getDirectoryContents(path)
    let result = ''
    
    if (prefix === '') {
      result = `${name}/\n`
    }
    
    if (contents) {
      contents.forEach((item, index) => {
        const itemPath = `${path}/${item}`
        const isLastItem = index === contents.length - 1
        const connector = isLastItem ? '└── ' : '├── '
        const extension = isLastItem ? '    ' : '│   '
        
        if (isDirectory(itemPath)) {
          result += `${prefix}${connector}${item}/\n`
          result += buildTree(itemPath, prefix + extension, isLastItem)
        } else {
          result += `${prefix}${connector}${item}\n`
        }
      })
    }
    
    return result
  }

  const tree = buildTree(targetPath)
  return { output: tree.trimEnd(), newDir: context.currentDir }
}, 'Display directory tree')

// OPEN command - open URLs
registerCommand('open', (args, context) => {
  const links = {
    'github': 'https://github.com/ray-bao-mcgill',
    'linkedin': 'https://linkedin.com/in/ray-bao-061728216/',
    'email': 'mailto:ray6bao@gmail.com',
    'resume': '/resume/resume.pdf'
  }

  if (!args[0]) {
    return {
      output: `Usage: open <target>\nAvailable: ${Object.keys(links).join(', ')}`,
      type: 'error',
      newDir: context.currentDir
    }
  }

  const target = args[0].toLowerCase()
  if (links[target]) {
    return {
      output: `Opening ${target}...`,
      type: 'success',
      openUrl: links[target],
      newDir: context.currentDir
    }
  }

  return {
    output: `Unknown target: ${target}. Available: ${Object.keys(links).join(', ')}`,
    type: 'error',
    newDir: context.currentDir
  }
}, 'Open external links')

// Get autocomplete suggestions
export const getAutocompleteSuggestions = (input, currentDir) => {
  const parts = input.split(' ')
  const cmd = parts[0].toLowerCase()
  const arg = parts.slice(1).join(' ')

  // If still typing command, suggest commands
  if (parts.length === 1) {
    return Object.keys(commands)
      .filter(c => c.startsWith(cmd))
      .map(c => c)
  }

  // Special handling for 'open' command
  if (cmd === 'open') {
    const openTargets = ['github', 'linkedin', 'email', 'resume']
    return openTargets.filter(t => t.startsWith(arg.toLowerCase()))
  }

  // If typing argument, suggest files/directories
  const contents = getDirectoryContents(currentDir)
  if (contents) {
    return contents
      .filter(item => item.toLowerCase().startsWith(arg.toLowerCase()))
      .map(item => {
        const itemPath = `${currentDir}/${item}`
        return isDirectory(itemPath) ? item + '/' : item
      })
  }

  return []
}
