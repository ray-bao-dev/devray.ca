document.addEventListener('DOMContentLoaded', () => {
    const terminalButton = document.getElementById('terminal-button');
    const terminalOverlay = document.getElementById('terminal-overlay');
    const terminalClose = document.querySelector('.terminal-close');
    const terminalContent = document.getElementById('terminal-content');
    const terminalInput = document.querySelector('.terminal-input');
    const terminalWindow = document.querySelector('.terminal-window');

    let currentDirectory = '/home/Ray_Bao';

    const fileSystem = {
        '/home/Ray_Bao': {
            type: 'directory',
            contents: ['summary.txt', 'resume.pdf', 'skills', 'projects', 'contact']
        },
        '/home/Ray_Bao/summary.txt': { type: 'file' },
        '/home/Ray_Bao/resume.pdf': { type: 'file' },
        '/home/Ray_Bao/skills': {
            type: 'directory',
            contents: ['html.txt', 'css.txt', 'javascript.txt', 'vue.txt', 'python.txt', 'java.txt', 'sql.txt', 'mongodb.txt', 'flask.txt', 'git.txt', 'aws.txt', 'azure.txt', 'docker.txt', 'openai.txt']
        },
        '/home/Ray_Bao/projects': {
            type: 'directory',
            contents: ['project1.txt', 'project2.txt', 'project3.txt']
        },
        '/home/Ray_Bao/contact': {
            type: 'directory',
            contents: ['email.txt', 'linkedin.txt', 'github.txt']
        }
        // ... add other directories and files as needed
    };

    const fileContents = {
        '/home/Ray_Bao/summary.txt': "I'm a 3rd year student currently majoring in Computer Science - Artificial Intelligence with a minor in Economics at McGill University. My strongest area of development is in Full-stack web development, with a focus on back-end scripting. I'm currently seeking full time internships or part-time employment opportunities in software development roles!",
        '/home/Ray_Bao/resume.pdf': "Opening resume...",
        '/home/Ray_Bao/skills/html.txt': "HTML (HyperText Markup Language) is the standard markup language for creating web pages. I have extensive experience in writing semantic and accessible HTML5 code.",
        '/home/Ray_Bao/skills/css.txt': "CSS (Cascading Style Sheets) is used for describing the presentation of a document written in HTML. I'm proficient in modern CSS techniques, including Flexbox and Grid layouts.",
        '/home/Ray_Bao/skills/javascript.txt': "JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. I have strong skills in both vanilla JavaScript and popular frameworks.",
        '/home/Ray_Bao/skills/vue.txt': "Vue.js is a progressive JavaScript framework for building user interfaces. I have experience in developing responsive and interactive web applications using Vue.js.",
        '/home/Ray_Bao/skills/python.txt': "Python is an interpreted, high-level and general-purpose programming language. I use Python for web development, scientific computing, data analysis, artificial intelligence, and machine learning projects.",
        '/home/Ray_Bao/skills/java.txt': "Java is a general-purpose programming language that is class-based, object-oriented, and designed to have as few implementation dependencies as possible. I have extensive experience in Java development.",
        '/home/Ray_Bao/skills/sql.txt': "SQL (Structured Query Language) is used for managing and manipulating relational databases. I'm proficient in writing complex queries and optimizing database performance.",
        '/home/Ray_Bao/skills/mongodb.txt': "MongoDB is a document-oriented NoSQL database. I have experience in designing and implementing MongoDB databases for various applications.",
        '/home/Ray_Bao/skills/flask.txt': "Flask is a lightweight WSGI web application framework in Python. I use Flask for building web applications and APIs quickly and efficiently.",
        '/home/Ray_Bao/skills/git.txt': "Git is a distributed version-control system for tracking changes in source code during software development. I use Git for version control and collaborative development in all my projects.",
        '/home/Ray_Bao/skills/aws.txt': "Amazon Web Services (AWS) is a comprehensive cloud computing platform. I have experience in deploying and managing applications on various AWS services.",
        '/home/Ray_Bao/skills/azure.txt': "Microsoft Azure is a cloud computing platform offering a wide range of services. I have experience working with Azure for building and deploying cloud-based applications.",
        '/home/Ray_Bao/skills/docker.txt': "Docker is a platform for developing, shipping, and running applications in containers. I use Docker for creating consistent development environments and deploying applications.",
        '/home/Ray_Bao/skills/openai.txt': "OpenAI is an artificial intelligence research laboratory. I have experience working with OpenAI's models and APIs for various AI and machine learning applications."
    };

    terminalButton.addEventListener('click', () => {
        terminalOverlay.style.display = 'flex';
        terminalInput.focus();
        updatePrompt();
    });

    terminalClose.addEventListener('click', closeTerminal);

    terminalOverlay.addEventListener('click', (e) => {
        if (e.target === terminalOverlay) {
            closeTerminal();
        }
    });

    terminalWindow.addEventListener('click', () => {
        terminalInput.focus();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && terminalOverlay.style.display === 'flex') {
            closeTerminal();
        }
    });

    function closeTerminal() {
        terminalOverlay.style.display = 'none';
    }

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            handleTabCompletion();
        } else if (e.key === 'Enter') {
            handleCommand();
        }
    });

    function handleTabCompletion() {
        const input = terminalInput.value;
        const lastWord = input.split(' ').pop();
        const suggestions = getAutocompleteSuggestions(lastWord);
        
        if (suggestions.length === 1) {
            terminalInput.value = input.substring(0, input.lastIndexOf(' ') + 1) + suggestions[0];
        } else if (suggestions.length > 1) {
            const output = document.createElement('div');
            output.textContent = suggestions.join('  ');
            terminalContent.querySelector('.terminal-output').appendChild(output);
            terminalContent.scrollTop = terminalContent.scrollHeight;
        }
    }

    function handleCommand() {
        const command = terminalInput.value.trim();
        const output = document.createElement('div');
        output.innerHTML = `<span class="terminal-prompt">Ray_Bao@devray:${currentDirectory}$</span> ${command}`;
        
        const response = processCommand(command);
        output.innerHTML += `<br>${response}`;

        terminalContent.querySelector('.terminal-output').appendChild(output);
        terminalInput.value = '';
        
        updatePrompt();
        
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    function updatePrompt() {
        const promptElement = document.querySelector('.prompt');
        if (promptElement) {
            promptElement.textContent = `[raybao@devray ${currentDirectory}]$ `;
        }
    }

    function processCommand(command) {
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (cmd) {
            case 'help':
                return 'Available commands: help, ls, cd, pwd, cat, clear';
            case 'clear':
                terminalContent.querySelector('.terminal-output').innerHTML = '';
                return '';
            case 'ls':
                return ls(args[0]);
            case 'cd':
                return cd(args[0]);
            case 'pwd':
                return currentDirectory;
            case 'cat':
                return cat(args[0]);
            default:
                return `Command not found: ${cmd}. Type 'help' for available commands.`;
        }
    }

    function ls(path) {
        const targetPath = path ? normalizePath(`${currentDirectory}/${path}`) : currentDirectory;
        if (fileSystem[targetPath]) {
            return fileSystem[targetPath].contents.map(item => {
                const itemPath = `${targetPath}/${item}`;
                if (fileSystem[itemPath] && fileSystem[itemPath].type === 'directory') {
                    return item + '/';
                } else {
                    return item;
                }
            }).join('  ');
        } else {
            return `ls: cannot access '${path}': No such file or directory`;
        }
    }

    function cd(path) {
        if (!path || path === '~') {
            currentDirectory = '/home/Ray_Bao';
            showSection('home-wrapper');
            return '';
        }
        
        let newPath = path.startsWith('/') ? path : `${currentDirectory}/${path}`;
        newPath = normalizePath(newPath);
        
        if (fileSystem[newPath] && fileSystem[newPath].type === 'directory') {
            currentDirectory = newPath;
            const section = newPath.split('/').pop();
            showSection(section === 'Ray_Bao' ? 'home-wrapper' : `${section}-wrapper`);
            return '';
        } else {
            return `cd: ${path}: No such directory`;
        }
    }

    function normalizePath(path) {
        const parts = path.split('/').filter(Boolean);
        const stack = [];
        for (const part of parts) {
            if (part === '..') {
                stack.pop();
            } else if (part !== '.') {
                stack.push(part);
            }
        }
        return '/' + stack.join('/');
    }

    function cat(filename) {
        const filePath = filename.startsWith('/') ? filename : `${currentDirectory}/${filename}`;
        const normalizedPath = normalizePath(filePath);
        if (fileContents[normalizedPath]) {
            if (normalizedPath.endsWith('resume.pdf')) {
                window.open('static/resume/resume.pdf', '_blank');
                return "Opening resume in a new tab...";
            }
            return fileContents[normalizedPath];
        } else {
            return `cat: ${filename}: No such file or directory`;
        }
    }

    function getAutocompleteSuggestions(partial) {
        const currentPath = normalizePath(`${currentDirectory}/${partial}`);
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        const prefix = partial.substring(partial.lastIndexOf('/') + 1);

        if (fileSystem[parentPath]) {
            return fileSystem[parentPath].contents
                .filter(item => item.startsWith(prefix))
                .map(item => {
                    const fullPath = `${parentPath}/${item}`;
                    return fileSystem[fullPath] && fileSystem[fullPath].type === 'directory'
                        ? item + '/'
                        : item;
                });
        }
        
        if (!partial.includes('/')) {
            const commands = ['help', 'ls', 'cd', 'pwd', 'cat', 'clear'];
            return commands.filter(cmd => cmd.startsWith(partial));
        }

        return [];

    }

    function showSection(section) {
        // Hide all sections
        document.querySelectorAll('.section-wrapper').forEach(el => {
            el.style.display = 'none';
            el.classList.remove('show');
        });

        // Show the selected section
        const sectionEl = document.querySelector(`.${section}`);
        if (sectionEl) {
            sectionEl.style.display = 'flex';
            // Use setTimeout to ensure the display change has taken effect before adding the 'show' class
            setTimeout(() => {
                sectionEl.classList.add('show');
            }, 10);
        }

        // Update the prompt
        updatePrompt();
    }

    updatePrompt();
});
