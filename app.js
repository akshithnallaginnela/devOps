// app.js - Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initParticles();
    animateCounters();
    renderPipeline();
    renderRoadmap();
    initCharts();
    initSimulators();
    initSyntaxHighlight();
    initWelcomeModal();
});

function initWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    const closeBtn = document.getElementById('closeModalBtn');
    
    // Check if user has visited before
    if(localStorage.getItem('devopsFlowVisited') === 'true') {
        modal.classList.add('hidden');
    }

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        localStorage.setItem('devopsFlowVisited', 'true');
    });
}

// Navigation & Theming
function initNavigation() {
    const links = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.page-section');
    const titleObj = document.getElementById('page-title');
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const targetId = link.getAttribute('data-target');
            sections.forEach(sec => {
                sec.classList.remove('active');
                if(sec.id === targetId) {
                    sec.classList.add('active');
                }
            });

            titleObj.textContent = link.textContent.trim();
            if(window.innerWidth <= 768) sidebar.classList.remove('open');
            
            // Re-trigger animation on charts based on section
            if(targetId === 'monitoring') initMonitoring();
        });
    });

    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

function showToast(msg, type='info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="material-icons-outlined">${type==='success'?'check_circle':type==='error'?'error':'info'}</span> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Background Particles
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    
    let particles = [];
    for(let i=0; i<50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }

    function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = 'rgba(74, 139, 245, 0.2)';
        ctx.strokeStyle = 'rgba(74, 139, 245, 0.05)';
        
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
            ctx.fill();

            for(let j=i+1; j<particles.length; j++) {
                let p2 = particles[j];
                let dist = Math.hypot(p.x-p2.x, p.y-p2.y);
                if(dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(draw);
    }
    draw();
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(c => {
        const target = +c.getAttribute('data-target');
        let count = 0;
        const inc = target / 50;
        const update = () => {
            count += inc;
            if(count < target) {
                c.innerText = Math.ceil(count);
                requestAnimationFrame(update);
            } else {
                c.innerText = target;
            }
        };
        update();
    });
}

// Pipeline Section
function renderPipeline() {
    const vis = document.getElementById('pipelineVisualizer');
    const panel = document.getElementById('pipelineDetailPanel');
    
    DevOpsData.pipelineStages.forEach((stage, i) => {
        const div = document.createElement('div');
        div.className = 'pipe-stage';
        div.innerHTML = `<span class="material-icons-outlined">${stage.icon}</span><br>${stage.name}`;
        div.id = `stage-${stage.id}`;
        
        div.addEventListener('click', () => {
            document.querySelectorAll('.pipe-stage').forEach(el=>el.style.transform = 'scale(1)');
            div.style.transform = 'scale(1.1)';
            
            document.getElementById('stageTitle').innerText = stage.name;
            document.getElementById('stageDesc').innerText = stage.desc;
            document.getElementById('stageTools').innerHTML = stage.tools.map(t => `<span>${t}</span>`).join('');
            document.getElementById('stageCode').innerText = stage.code;
            document.getElementById('stageBestPractices').innerHTML = stage.best.map(b => `<li>${b}</li>`).join('');
            
            panel.classList.remove('hidden');
            panel.classList.add('visible');
            initSyntaxHighlight();
        });

        vis.appendChild(div);
        if(i < DevOpsData.pipelineStages.length -1) {
            const line = document.createElement('div');
            line.className = 'pipe-line';
            vis.appendChild(line);
        }
    });

    document.getElementById('runPipelineBtn').addEventListener('click', async () => {
        const stages = document.querySelectorAll('.pipe-stage');
        stages.forEach(s => { s.classList.remove('success', 'running', 'error'); });
        
        for(let i=0; i<stages.length; i++) {
            stages[i].classList.add('running');
            await new Promise(r => setTimeout(r, 800)); // simulate work
            stages[i].classList.remove('running');
            
            // Random failure simulation on Test or Deploy randomly (10% chance)
            if((i===2 || i===5) && Math.random() < 0.1) {
                stages[i].classList.add('error');
                showToast(`Pipeline failed at ${DevOpsData.pipelineStages[i].name}`, 'error');
                return;
            }
            stages[i].classList.add('success');
        }
        showToast('Pipeline completed successfully!', 'success');
    });
}

// Map localStorage Roadmap
function renderRoadmap() {
    const tl = document.getElementById('roadmapTimeline');
    let saved = JSON.parse(localStorage.getItem('devopsRoadmap')) || {};
    let completedCount = 0;

    DevOpsData.roadmap.forEach((item, i) => {
        const div = document.createElement('div');
        const isDone = saved[item.id] === true;
        if(isDone) completedCount++;
        
        div.className = `roadmap-item ${isDone ? 'completed' : ''}`;
        div.innerHTML = `
            <h4>${i+1}. ${item.title} <span style="float:right; font-size:0.8rem">${item.time}</span></h4>
            <p class="desc">${item.desc}</p>
            <div class="road-tags">${item.tags.map(t=>`<span>${t}</span>`).join('')}</div>
            <button class="btn sm ${isDone ? 'secondary':'primary'}" style="margin-top:10px" onclick="toggleRoadmap('${item.id}', this)">
                ${isDone ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
        `;
        tl.appendChild(div);
    });

    updateRoadmapProgress(completedCount, DevOpsData.roadmap.length);
}

window.toggleRoadmap = function(id, btn) {
    let saved = JSON.parse(localStorage.getItem('devopsRoadmap')) || {};
    saved[id] = !saved[id];
    localStorage.setItem('devopsRoadmap', JSON.stringify(saved));
    
    // re-render logic via parent reload or class toggle
    const item = btn.parentElement;
    item.classList.toggle('completed');
    btn.className = saved[id] ? 'btn sm secondary' : 'btn sm primary';
    btn.innerText = saved[id] ? 'Mark Incomplete' : 'Mark Complete';
    
    const count = Object.values(saved).filter(v=>v).length;
    updateRoadmapProgress(count, DevOpsData.roadmap.length);
    if(saved[id]) showToast('Milestone completed!', 'success');
}

function updateRoadmapProgress(done, total) {
    const pct = Math.round((done/total)*100);
    document.getElementById('roadmapProgressText').innerText = `${pct}% Complete`;
    document.getElementById('roadmapProgressBar').style.width = `${pct}%`;
}

// Charts Init
function initCharts() {
    setTimeout(() => {
        ChartTools.drawLineChart('progressChart', [10, 20, 35, 50, 55, 75, 80, 95], ['W1','W2','W3','W4','W5','W6','W7','W8'], '#4a8bf5');
        ChartTools.drawDonutChart('skillRadar', [30, 25, 20, 15, 10], ['#4a8bf5', '#22c55e', '#8b5cf6', '#f97316', '#eab308'], ['CI/CD', 'Docker', 'K8s', 'IaC', 'Cloud']);
    }, 100);
}

// Docker & Monitoring Simulators
let logInterval;
function initSimulators() {
    // Docker commands
    const cList = document.getElementById('dockerCmdList');
    const cDet = document.getElementById('dockerCmdDetail');
    DevOpsData.dockerCmds.forEach(cmd => {
        const li = document.createElement('li');
        li.innerHTML = `<code>${cmd.cmd.split(' ')[1]}</code>`;
        li.style.cursor = 'pointer';
        li.style.padding = '5px';
        li.addEventListener('click', () => {
            cDet.innerHTML = `<strong>${cmd.cmd}</strong><br><p>${cmd.desc}</p>`;
        });
        cList.appendChild(li);
    });

    // Container Create simulator
    let cId = 1;
    const cGrid = document.getElementById('containerGrid');
    document.getElementById('createContainerBtn').addEventListener('click', () => {
        if(cGrid.children.length > 5) { showToast('Max containers reached', 'error'); return; }
        const div = document.createElement('div');
        div.className = 'c-card';
        div.innerHTML = `
            <strong>app_web_${cId}</strong>
            <p>nginx:alpine</p>
            <p>Status: <span style="color:var(--green)">Running</span></p>
            <div class="c-actions">
                <button class="btn sm secondary stop-btn">Stop</button>
                <button class="btn sm secondary rm-btn">Rm</button>
            </div>
        `;
        const stopBtn = div.querySelector('.stop-btn');
        stopBtn.addEventListener('click', () => {
            div.classList.add('stopped');
            div.innerHTML = div.innerHTML.replace('Running', 'Stopped').replace('var(--green)', 'var(--text-muted)');
            showToast('Container stopped');
        });
        div.querySelector('.rm-btn').addEventListener('click', () => {
            div.remove();
            showToast('Container removed');
        });

        cGrid.appendChild(div);
        cId++;
        showToast('Container started', 'success');
    });

    // K8s
    const podStatuses = ['Pending', 'ContainerCreating', 'Running'];
    let curState = 0;
    setInterval(() => {
        const spans = document.querySelectorAll('#podLifecycle span');
        if(!spans.length) return;
        spans.forEach(s => s.style.fontWeight = 'normal');
        spans[curState].style.fontWeight = 'bold';
        spans[curState].style.transform = 'scale(1.1)';
        curState = (curState + 1) % spans.length;
    }, 1500);

    // Dummy K8s nodes Draw
    const k8sCanvas = document.getElementById('k8sCanvas');
    if(k8sCanvas) {
        const c2 = k8sCanvas.getContext('2d');
        k8sCanvas.width = k8sCanvas.parentElement.clientWidth;
        c2.fillStyle = '#f8fafc'; c2.fillRect(50, 20, 150, 100);
        c2.strokeRect(50, 20, 150, 100);
        c2.fillStyle = '#333'; c2.fillText('Control Plane', 90, 50);
    }
}

let cpuData = [10, 20, 15, 30, 40, 20];
let memData = [50, 52, 55, 60, 58, 62];

function initMonitoring() {
    const term = document.getElementById('logStream');
    if(logInterval) clearInterval(logInterval);
    
    ChartTools.drawLineChart('cpuChart', cpuData, ['','','','','',''], '#4a8bf5');
    ChartTools.drawLineChart('memChart', memData, ['','','','','',''], '#8b5cf6');
    ChartTools.drawGauge('errGauge', 2, 100, '#ef4444');

    let paused = false;
    document.getElementById('toggleLogsBtn').addEventListener('click', (e) => {
        paused = !paused;
        e.target.innerText = paused ? 'Resume' : 'Pause';
    });

    logInterval = setInterval(() => {
        if(paused) return;
        // update charts
        cpuData.shift(); cpuData.push(Math.floor(Math.random()*80 + 10));
        memData.shift(); memData.push(Math.floor(Math.random()*20 + 50));
        ChartTools.drawLineChart('cpuChart', cpuData, ['','','','','',''], '#4a8bf5');
        ChartTools.drawLineChart('memChart', memData, ['','','','','',''], '#8b5cf6');
        ChartTools.drawGauge('errGauge', Math.floor(Math.random()*10), 100, '#ef4444');

        // add log
        const levels = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR'];
        const lvl = levels[Math.floor(Math.random()*levels.length)];
        const cls = lvl === 'INFO' ? 'log-info' : lvl === 'WARN' ? 'log-warn' : 'log-error';
        const msgs = ['Handling request UI-12', 'DB connection latency', 'Failed to auth user', 'Cache hit ratio 95%'];
        const m = msgs[Math.floor(Math.random()*msgs.length)];
        
        const line = document.createElement('div');
        line.className = 'log-line';
        line.innerHTML = `[${new Date().toISOString().split('T')[1].slice(0,-1)}] <span class="${cls}">${lvl}</span> ${m}`;
        term.appendChild(line);
        term.scrollTop = term.scrollHeight;
        if(term.children.length > 50) term.removeChild(term.firstChild);

    }, 3000);
}

// Simple highlighter (Replacing literal keywords)
function initSyntaxHighlight() {
    const blocks = document.querySelectorAll('code');
    blocks.forEach(b => {
        if(b.innerHTML.includes('<span')) return; // already parsed
        let text = b.innerText;
        text = text.replace(/(git|npm|docker|kubectl|terraform)/g, '<span class="kw">$1</span>');
        text = text.replace(/(".*?"|'.*?')/g, '<span class="str">$1</span>');
        text = text.replace(/(\b\d+\b)/g, '<span class="num">$1</span>');
        b.innerHTML = text;
    });
}