// terminal.js - Interactive In-Browser Linux Simulator

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('termInput');
    const output = document.getElementById('termOutput');
    const promptEl = document.getElementById('termPrompt');
    const terminalContainer = document.getElementById('interactiveTerminal');
    
    // Command History
    let commandHistory = [];
    let historyIndex = -1;

    // Virtual File System
    let vfs = {
        '~': {
            type: 'dir',
            contents: {
                'readme.txt': { type: 'file', content: 'Welcome to DevOpsFlow Terminal! Practice your Linux commands here.\nTry typing "help" to see available commands.' }
            }
        }
    };
    
    let currentPath = ['~'];

    function getDir(pathArray) {
        let current = vfs['~'];
        for (let i = 1; i < pathArray.length; i++) {
            current = current.contents[pathArray[i]];
        }
        return current;
    }

    function print(text, color = '#fff') {
        const div = document.createElement('div');
        div.style.color = color;
        div.style.marginBottom = '4px';
        div.style.whiteSpace = 'pre-wrap';
        div.style.lineHeight = '1.4';
        div.textContent = text;
        output.appendChild(div);
        
        // Auto-scroll
        setTimeout(() => {
            if(terminalContainer) terminalContainer.scrollTop = terminalContainer.scrollHeight;
        }, 10);
    }

    function executeCommand(cmdStr) {
        const args = cmdStr.trim().split(/\s+/);
        const cmd = args[0].toLowerCase();
        
        if (!cmd) return;

        print(`${promptEl.textContent} ${cmdStr}`, '#ccc');

        const dir = getDir(currentPath);

        switch (cmd) {
            case 'help':
                print('Available commands:\n  pwd    - Print Working Directory (where am I?)\n  ls     - List files in current directory\n  cd     - Change directory (e.g., cd folder or cd ..)\n  mkdir  - Make a new directory\n  echo   - Print text or write to file (echo "text" > file.txt)\n  cat    - Read a file\n  whoami - Show current user\n  date   - Show system date\n  clear  - Clear the screen', '#569cd6');
                break;
            case 'whoami': print('student'); break;
            case 'date': print(new Date().toString()); break;
            case 'pwd':
                print('/home/student' + (currentPath.length > 1 ? '/' + currentPath.slice(1).join('/') : ''));
                break;
            case 'ls':
                if (Object.keys(dir.contents).length === 0) break;
                const items = Object.keys(dir.contents).map(k => {
                    return dir.contents[k].type === 'dir' ? `<span style="color:#569cd6; font-weight:bold;">${k}/</span>` : k;
                });
                const lsDiv = document.createElement('div');
                lsDiv.innerHTML = items.join('  ');
                lsDiv.style.marginBottom = '4px';
                output.appendChild(lsDiv);
                break;
            case 'cd':
                const target = args[1] || '~';
                if (target === '~') {
                    currentPath = ['~'];
                } else if (target === '..') {
                    if (currentPath.length > 1) currentPath.pop();
                } else if (dir.contents[target]) {
                    if (dir.contents[target].type === 'dir') currentPath.push(target);
                    else print(`cd: ${target}: Not a directory`, '#ef4444');
                } else print(`cd: ${target}: No such directory`, '#ef4444');
                break;
            case 'mkdir':
                if (args[1]) {
                    if(!dir.contents[args[1]]) dir.contents[args[1]] = { type: 'dir', contents: {} };
                    else print(`mkdir: cannot create directory '${args[1]}': File exists`, '#ef4444');
                } else print('mkdir: missing operand', '#ef4444');
                break;
            case 'echo':
                const redirectIdx = args.indexOf('>');
                if (redirectIdx > -1) {
                    const text = args.slice(1, redirectIdx).join(' ').replace(/['"]/g, '');
                    const fileName = args[redirectIdx + 1];
                    if(fileName) dir.contents[fileName] = { type: 'file', content: text };
                } else print(args.slice(1).join(' ').replace(/['"]/g, ''));
                break;
            case 'cat':
                const file = args[1];
                if (file) {
                    if (dir.contents[file]) {
                        if(dir.contents[file].type === 'file') print(dir.contents[file].content);
                        else print(`cat: ${file}: Is a directory`, '#ef4444');
                    } else print(`cat: ${file}: No such file`, '#ef4444');
                } else print('cat: missing operand', '#ef4444');
                break;
            case 'clear':
                output.innerHTML = '';
                break;
            default:
                print(`bash: ${cmd}: command not found. Type "help" for a list of commands.`, '#ef4444');
        }

        const displayPath = currentPath.length === 1 ? '~' : '~/' + currentPath.slice(1).join('/');
        promptEl.textContent = `student@devopsflow:${displayPath}$`;
        
        setTimeout(() => { if(terminalContainer) terminalContainer.scrollTop = terminalContainer.scrollHeight; }, 10);
    }

    if(input) {
        if(terminalContainer) terminalContainer.addEventListener('click', () => input.focus());

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value;
                if(cmd.trim() !== '') {
                    commandHistory.push(cmd);
                    historyIndex = commandHistory.length;
                }
                input.value = '';
                executeCommand(cmd);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    input.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    input.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    input.value = '';
                }
            }
        });
    }
});