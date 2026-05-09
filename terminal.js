// terminal.js - Interactive In-Browser PowerShell Simulator

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('termInput');
    const output = document.getElementById('termOutput');
    const promptEl = document.getElementById('termPrompt');
    
    // Virtual File System
    let vfs = {
        'C:': {
            type: 'dir',
            contents: {
                'Users': {
                    type: 'dir',
                    contents: {
                        'student': {
                            type: 'dir',
                            contents: {
                                'readme.txt': { type: 'file', content: 'Welcome to DevOpsFlow PowerShell! Practice your DevOps skills here.' }
                            }
                        }
                    }
                }
            }
        }
    };
    
    let currentPath = ['C:', 'Users', 'student'];

    function getDir(pathArray) {
        let current = vfs;
        for (let i = 0; i < pathArray.length; i++) {
            if (current && current[pathArray[i]]) {
                current = current[pathArray[i]].contents || current[pathArray[i]];
            } else {
                return null;
            }
        }
        return current;
    }

    function print(text, color = '#cccccc') {
        const div = document.createElement('div');
        div.style.color = color;
        div.style.marginBottom = '2px';
        div.style.whiteSpace = 'pre-wrap';
        div.style.fontFamily = "Consolas, 'Courier New', monospace";
        div.textContent = text;
        output.appendChild(div);
        document.getElementById('interactiveTerminal').scrollTop = document.getElementById('interactiveTerminal').scrollHeight;
    }

    function executeCommand(cmdStr) {
        const args = cmdStr.trim().split(/\s+/);
        const cmd = args[0].toLowerCase();
        
        if (!cmd) return;

        print(`${promptEl.textContent} ${cmdStr}`, '#ffffff');

        const dir = getDir(currentPath);

        switch (cmd) {
            case 'pwd':
            case 'get-location':
                print(`\nPath\n----\n${currentPath.join('\\')}\n`);
                break;
            case 'ls':
            case 'dir':
            case 'get-childitem':
                if (!dir) break;
                let table = `\n    Directory: ${currentPath.join('\\')}\n\nMode                 LastWriteTime         Length Name\n----                 -------------         ------ ----\n`;
                Object.keys(dir).forEach(k => {
                    const isDir = dir[k].type === 'dir';
                    const mode = isDir ? 'd-----' : '-a----';
                    const time = new Date().toLocaleString('en-US', { hour12: true, month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                    const length = isDir ? '' : dir[k].content.length.toString().padStart(6, ' ');
                    table += `${mode}        ${time} ${length} ${k}\n`;
                });
                print(table);
                break;
            case 'cd':
            case 'set-location':
                const target = args[1] || 'C:\\Users\\student';
                if (target === '~') {
                    currentPath = ['C:', 'Users', 'student'];
                } else if (target === '..') {
                    if (currentPath.length > 1) currentPath.pop();
                } else {
                    const targetParts = target.replace(/\//g, '\\').split('\\').filter(p => p !== '');
                    let tempPath = [...currentPath];
                    
                    if (target.includes(':')) {
                        tempPath = []; // Absolute path
                    }
                    
                    for (let p of targetParts) {
                        if (p === '..') tempPath.pop();
                        else tempPath.push(p);
                    }
                    
                    if (getDir(tempPath)) {
                        currentPath = tempPath;
                    } else {
                        print(`Set-Location : Cannot find path '${target}' because it does not exist.`, '#ff4444');
                    }
                }
                break;
            case 'mkdir':
            case 'md':
                if (args[1]) dir[args[1]] = { type: 'dir', contents: {} };
                else print('mkdir : Cannot bind argument to parameter \'Path\' because it is null.', '#ff4444');
                break;
            case 'echo':
            case 'write-output':
                const redirectIdx = args.indexOf('>');
                if (redirectIdx > -1) {
                    const text = args.slice(1, redirectIdx).join(' ').replace(/['"]/g, '');
                    const fileName = args[redirectIdx + 1];
                    if(fileName) {
                        dir[fileName] = { type: 'file', content: text };
                    }
                } else {
                    print(args.slice(1).join(' ').replace(/['"]/g, ''));
                }
                break;
            case 'cat':
            case 'get-content':
                const file = args[1];
                if (file && dir[file] && dir[file].type === 'file') {
                    print(dir[file].content);
                } else {
                    print(`Get-Content : Cannot find path '${currentPath.join('\\')}\\${file}' because it does not exist.`, '#ff4444');
                }
                break;
            case 'clear':
            case 'cls':
            case 'clear-host':
                output.innerHTML = '';
                break;
            default:
                print(`${cmd} : The term '${cmd}' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.\nAt line:1 char:1\n+ ${cmd}\n+ ~~~~~\n    + CategoryInfo          : ObjectNotFound: (${cmd}:String) [], CommandNotFoundException\n    + FullyQualifiedErrorId : CommandNotFoundException\n`, '#ff4444');
        }

        // Update prompt
        promptEl.textContent = `PS ${currentPath.join('\\')}>`;
    }

    // Initialize prompt
    promptEl.textContent = `PS ${currentPath.join('\\')}>`;

    if(input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value;
                input.value = '';
                executeCommand(cmd);
            }
        });
    }
});