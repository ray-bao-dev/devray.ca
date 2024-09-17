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
            contents: ['about', 'skills', 'projects', 'contact']
        },
        '/home/Ray_Bao/about': {
            type: 'directory',
            contents: ['summary.txt', 'resume.pdf']
        },
        '/home/Ray_Bao/skills': {
            type: 'directory',
            contents: ['web_dev', 'prog_lang', 'db_backend', 'version_ctrl', 'cloud_ai']
        },
        '/home/Ray_Bao/skills/web_dev': {
            type: 'directory',
            contents: ['html.txt', 'css.txt', 'javascript.txt', 'vue.txt', 'nodejs.txt']
        },
        '/home/Ray_Bao/skills/prog_lang': {
            type: 'directory',
            contents: ['java.txt', 'cpp.txt', 'python.txt']
        },
        '/home/Ray_Bao/skills/db_backend': {
            type: 'directory',
            contents: ['mysql.txt', 'php.txt', 'flask.txt']
        },
        '/home/Ray_Bao/skills/version_ctrl': {
            type: 'directory',
            contents: ['git.txt']
        },
        '/home/Ray_Bao/skills/cloud_ai': {
            type: 'directory',
            contents: ['aws.txt', 'azure.txt', 'docker.txt', 'openai.txt']
        },
        '/home/Ray_Bao/projects': {
            type: 'directory',
            contents: ['project1.txt', 'project2.txt', 'project3.txt']
        },
        '/home/Ray_Bao/contact': {
            type: 'directory',
            contents: ['email.txt', 'linkedin.txt', 'github.txt']
        }
    };

    const fileContents = {
        '/home/Ray_Bao/about/summary.txt': "I'm a 3rd year student currently majoring in Computer Science - Artificial Intelligence with a minor in Economics at McGill University. My strongest area of development is in Full-stack web development, with a focus on back-end scripting. I'm currently seeking full time internships or part-time employment opportunities in software development roles!",
        '/home/Ray_Bao/about/resume.pdf': "Opening resume...",
        '/home/Ray_Bao/skills/web_dev/html.txt': "HTML (HyperText Markup Language) is the standard markup language for creating web pages. I have extensive experience in writing semantic and accessible HTML5 code.",
        '/home/Ray_Bao/skills/web_dev/css.txt': "CSS (Cascading Style Sheets) is used for describing the presentation of a document written in HTML. I'm proficient in modern CSS techniques, including Flexbox and Grid layouts.",
        '/home/Ray_Bao/skills/web_dev/javascript.txt': "JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. I have strong skills in both vanilla JavaScript and popular frameworks.",
        '/home/Ray_Bao/skills/web_dev/vue.txt': "Vue.js is a progressive JavaScript framework for building user interfaces. I have experience in developing responsive and interactive web applications using Vue.js.",
        '/home/Ray_Bao/skills/web_dev/nodejs.txt': "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. I use Node.js for server-side programming and building scalable network applications.",
        '/home/Ray_Bao/skills/prog_lang/java.txt': "Java is a general-purpose programming language that is class-based, object-oriented, and designed to have as few implementation dependencies as possible. I have extensive experience in Java development.",
        '/home/Ray_Bao/skills/prog_lang/cpp.txt': "C++ is a general-purpose programming language created as an extension of the C programming language. I use C++ for system/application software, drivers, client-server applications and embedded firmware.",
        '/home/Ray_Bao/skills/prog_lang/python.txt': "Python is an interpreted, high-level and general-purpose programming language. I use Python for web development, scientific computing, data analysis, artificial intelligence, and machine learning projects.",
        '/home/Ray_Bao/skills/db_backend/mysql.txt': "MySQL is an open-source relational database management system. I have experience in designing, implementing, and optimizing MySQL databases for various applications.",
        '/home/Ray_Bao/skills/db_backend/php.txt': "PHP is a popular general-purpose scripting language that is especially suited to web development. I use PHP for server-side scripting, command-line scripting, and writing desktop applications.",
        '/home/Ray_Bao/skills/db_backend/flask.txt': "Flask is a lightweight WSGI web application framework in Python. I use Flask for building web applications and APIs quickly and efficiently.",
        '/home/Ray_Bao/skills/version_ctrl/git.txt': "Git is a distributed version-control system for tracking changes in source code during software development. I use Git for version control and collaborative development in all my projects.",
        '/home/Ray_Bao/skills/cloud_ai/aws.txt': "Amazon Web Services (AWS) is a comprehensive cloud computing platform. I have experience in deploying and managing applications on various AWS services.",
        '/home/Ray_Bao/skills/cloud_ai/azure.txt': "Microsoft Azure is a cloud computing platform offering a wide range of services. I have experience working with Azure for building and deploying cloud-based applications.",
        '/home/Ray_Bao/skills/cloud_ai/docker.txt': "Docker is a platform for developing, shipping, and running applications in containers. I use Docker for creating consistent development environments and deploying applications.",
        '/home/Ray_Bao/skills/cloud_ai/openai.txt': "OpenAI is an artificial intelligence research laboratory. I have experience working with OpenAI's models and APIs for various AI and machine learning applications.",
        '/home/Ray_Bao/projects/project1.txt': "Project 1: Personal Portfolio Website",
        '/home/Ray_Bao/projects/project2.txt': "Project 2: E-commerce Platform",
        '/home/Ray_Bao/projects/project3.txt': "Project 3: Machine Learning Model for Image Recognition",
        '/home/Ray_Bao/contact/email.txt': "ray.bao@mail.mcgill.ca",
        '/home/Ray_Bao/contact/linkedin.txt': "https://www.linkedin.com/in/ray-bao",
        '/home/Ray_Bao/contact/github.txt': "https://github.com/ray-bao-mcgill"
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
        const promptSpan = document.querySelector('.terminal-input-line .terminal-prompt');
        promptSpan.textContent = `Ray_Bao@devray:${currentDirectory}$`;
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
            return fileSystem[targetPath].contents.join('  ');
        } else {
            return `ls: cannot access '${path}': No such file or directory`;
        }
    }

    function cd(path) {
        if (!path || path === '~') {
            currentDirectory = '/home/Ray_Bao';
            return '';
        }
        
        let newPath = path.startsWith('/') ? path : `${currentDirectory}/${path}`;
        newPath = normalizePath(newPath);
        
        if (fileSystem[newPath] && fileSystem[newPath].type === 'directory') {
            currentDirectory = newPath;
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

    updatePrompt();
});