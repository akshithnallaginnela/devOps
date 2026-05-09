// app.js - Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initParticles();
    animateCounters();
    renderPipeline();
    renderRoadmap();
    initCharts();
    initSimulators();
    initCodeSnippets();
    initSyntaxHighlight();
    initWelcomeModal();
});

function initCodeSnippets() {
    const tfCode = document.getElementById('tfCode');
    if (tfCode) {
        tfCode.innerText = `# Define the cloud provider (AWS)
provider "aws" {
  region = "us-east-1"
}

# Create a Virtual Private Cloud (VPC)
resource "aws_vpc" "main_vpc" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "Production-VPC"
  }
}

# Provision an EC2 instance (Virtual Server)
resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Ubuntu base image
  instance_type = "t2.micro"              # 1 CPU, 1GB RAM
  subnet_id     = aws_vpc.main_vpc.id

  tags = {
    Name = "Frontend-WebServer"
  }
}`;
    }

    const dockerCode = document.getElementById('dockerfileCode');
    if (dockerCode) {
        dockerCode.innerText = `# Stage 1: Build the Node.js application
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies (leverage cache)
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine
# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]`;
    }

    const sampleConfig = document.getElementById('sampleConfigCode');
    if (sampleConfig) {
        sampleConfig.innerText = `pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                sh 'kubectl apply -f deployment.yaml'
            }
        }
    }
}`;
    }
}

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
    const logContainer = document.getElementById('pipelineLogContainer');
    const logs = document.getElementById('pipelineLiveLogs');
    const statusSpan = document.getElementById('pipelineStatusSpan');
    
    vis.innerHTML = '';
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

    const mockLogsData = {
        'code': ['Fetching latest commits from remote...', 'Checking branch protection rules...', 'Checked out to commit 9f2a4b8'],
        'build': ['Running "npm ci"...', 'Building production bundle...', 'Creating Docker image...'],
        'test': ['Running Jest test suites...', 'Test suite 1 passed (12ms)', 'Test suite 2 passed (8ms)', 'Coverage: 92%'],
        'scan': ['Running SonarQube analysis...', '0 Critical Vulnerabilities found.', 'Code Quality Gate passed.'],
        'stage': ['Initializing Terraform...', 'Terraform applied successfully...', 'Deploying to staging cluster...'],
        'deploy': ['Updating K8s deployment "web-app"...', 'Rolling out revision 4...', 'Deployment successful.'],
        'monitor': ['Configuring Prometheus targets...', 'Verifying Grafana dashboards...', 'Pipeline Complete. App is live.']
    };

    document.getElementById('runPipelineBtn').addEventListener('click', async () => {
        const stages = document.querySelectorAll('.pipe-stage');
        stages.forEach(s => { s.classList.remove('success', 'running', 'error'); });
        
        logContainer.style.display = 'block';
        logs.innerHTML = '';
        statusSpan.innerText = 'Running...';
        statusSpan.style.color = 'var(--orange)';
        
        for(let i=0; i<stages.length; i++) {
            stages[i].classList.add('running');
            
            // push logs for this stage
            const stageId = DevOpsData.pipelineStages[i].id;
            for(let msg of mockLogsData[stageId]) {
                logs.innerHTML += `<div>[${new Date().toISOString().split('T')[1].substring(0,8)}] <strong style="color:var(--primary)">[${stageId}]</strong> ${msg}</div>`;
                logs.scrollTop = logs.scrollHeight;
                await new Promise(r => setTimeout(r, 400));
            }

            stages[i].classList.remove('running');
            
            // Simulate random deploy failure (10% chance) unless it's code/build
            if(i > 1 && Math.random() < 0.1) {
                stages[i].classList.add('error');
                logs.innerHTML += `<div style="color: #ef4444; font-weight:bold;">[ERROR] Pipeline failed at ${DevOpsData.pipelineStages[i].name} stage. Aborting.</div>`;
                statusSpan.innerText = 'Failed';
                statusSpan.style.color = '#ef4444';
                showToast(`Pipeline failed at ${DevOpsData.pipelineStages[i].name}`, 'error');
                return;
            }
            stages[i].classList.add('success');
        }
        
        statusSpan.innerText = 'Success';
        statusSpan.style.color = 'var(--green)';
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
let containerMetricsInterval;
function initSimulators() {
    // Docker commands reference
    const cList = document.getElementById('dockerCmdList');
    const cDet = document.getElementById('dockerCmdDetail');
    if(cList) {
        DevOpsData.dockerCmds.forEach(cmd => {
            const li = document.createElement('li');
            li.innerHTML = `<code>${cmd.cmd.split(' ')[1]}</code>`;
            li.style.cursor = 'pointer';
            li.style.padding = '5px';
            li.addEventListener('click', () => cDet.innerHTML = `<strong>${cmd.cmd}</strong><br><p>${cmd.desc}</p>`);
            cList.appendChild(li);
        });
    }

    // Advanced Container Simulator
    let cId = 1;
    const cGrid = document.getElementById('containerGrid');
    
    // Live update CPU/RAM for all running containers
    if(containerMetricsInterval) clearInterval(containerMetricsInterval);
    containerMetricsInterval = setInterval(() => {
        document.querySelectorAll('.c-card:not(.stopped)').forEach(c => {
            const cpuBar = c.querySelector('.cpu-fill');
            const ramBar = c.querySelector('.ram-fill');
            if(cpuBar && ramBar) {
                cpuBar.style.width = Math.floor(Math.random() * 40 + 5) + '%';
                ramBar.style.width = Math.floor(Math.random() * 60 + 20) + '%';
            }
        });
    }, 1500);

    const createBtn = document.getElementById('createContainerBtn');
    if(createBtn) {
        createBtn.addEventListener('click', async () => {
            if(cGrid.children.length > 7) { showToast('Server out of memory! Stop a container first.', 'error'); return; }
            
            const div = document.createElement('div');
            div.className = 'c-card';
            div.innerHTML = `
                <h4>web_api_${cId} <span class="badge">Running</span></h4>
                <p style="font-size:0.8rem; color:#666;">Image: node:18-alpine<br>Port: 80${cId}->8080</p>
                <div class="c-metrics">
                    CPU Usage <div class="bar"><div class="fill cpu-fill" style="width: 5%;"></div></div>
                    RAM Usage <div class="bar"><div class="fill ram-fill" style="width: 25%; background: #4a8bf5;"></div></div>
                </div>
                <div class="c-actions">
                    <button class="btn sm secondary stop-btn">Stop</button>
                    <button class="btn sm secondary rm-btn">Rm</button>
                    <button class="btn sm primary log-btn" style="padding:4px"><span class="material-icons-outlined" style="font-size:14px">terminal</span></button>
                </div>
            `;

            const currentCId = cId;
            const stopBtn = div.querySelector('.stop-btn');
            stopBtn.addEventListener('click', () => {
                div.classList.add('stopped');
                div.querySelector('.badge').innerText = 'Stopped';
                div.querySelector('.badge').style.background = '#eee';
                div.querySelector('.badge').style.color = '#666';
                div.querySelector('.cpu-fill').style.width = '0%';
                div.querySelector('.ram-fill').style.width = '0%';
                showToast(`Container web_api_${currentCId} stopped`);
            });
            div.querySelector('.rm-btn').addEventListener('click', () => {
                div.style.transform = 'scale(0)';
                setTimeout(() => div.remove(), 200);
                showToast(`Container web_api_${currentCId} removed`);
            });
            div.querySelector('.log-btn').addEventListener('click', () => {
                if(div.classList.contains('stopped')) showToast('Cannot view logs of stopped container.', 'info');
                else showToast(`[web_api_${currentCId}] Listening on port 8080... OK`, 'info');
            });

            cGrid.appendChild(div);
            cId++;
            showToast('Pulled image node:18-alpine and started container.', 'success');
        });
    }

    // Advanced K8s Cluster Simulator
    const k8sCluster = document.querySelector('.k8s-cluster-visual');
    if(k8sCluster) {
        let nodes = [
            { id: 1, name: 'Worker 1', active: true, pods: 0 },
            { id: 2, name: 'Worker 2', active: true, pods: 0 },
            { id: 3, name: 'Worker 3', active: true, pods: 0 }
        ];
        let totalPods = 0;

        function renderNodes() {
            k8sCluster.innerHTML = '';
            nodes.forEach(n => {
                const nDiv = document.createElement('div');
                nDiv.className = `k8s-node-box ${!n.active ? 'offline' : ''}`;
                nDiv.id = `node-${n.id}`;
                nDiv.innerHTML = `
                    <div class="k8s-node-header">
                        <span class="material-icons-outlined" style="color: ${n.active?'#22c55e':'#ef4444'}">dns</span> 
                        ${n.name}
                    </div>
                    <div class="pod-grid" id="pod-grid-${n.id}"></div>
                `;
                k8sCluster.appendChild(nDiv);
            });
            // Re-render exact number of pods across active nodes
            let podsToDistribute = totalPods;
            const activeNodes = nodes.filter(n=>n.active);
            if(activeNodes.length > 0) {
                while(podsToDistribute > 0) {
                    const pickedNode = activeNodes[podsToDistribute % activeNodes.length];
                    const pg = document.getElementById(`pod-grid-${pickedNode.id}`);
                    pg.innerHTML += `<div class="k8s-pod"><span class="material-icons-outlined" style="font-size:14px">view_in_ar</span> Pod</div>`;
                    podsToDistribute--;
                }
            }
        }
        
        renderNodes();

        document.getElementById('k8sScaleUpBtn').addEventListener('click', async () => {
            if(nodes.filter(n=>n.active).length === 0) { showToast('No active nodes to schedule pods!', 'error'); return; }
            if(totalPods > 15) { showToast('HPA Max limit reached (15)', 'error'); return; }
            
            showToast('HPA Triggered: Scaling Up...', 'info');
            totalPods++;
            renderNodes();
            // Highlight the newest pod as pending then running
            const activeNodes = nodes.filter(n=>n.active);
            const targetNodeId = activeNodes[totalPods % activeNodes.length].id;
            const lastPod = document.getElementById(`pod-grid-${targetNodeId}`).lastElementChild;
            if(lastPod) {
                lastPod.classList.add('pending');
                setTimeout(() => lastPod.classList.remove('pending'), 1000);
            }
        });

        document.getElementById('k8sScaleDownBtn').addEventListener('click', () => {
            if(totalPods > 0) {
                totalPods--;
                showToast('HPA Triggered: Scaling Down...', 'info');
                renderNodes();
            }
        });

        document.getElementById('k8sKillNodeBtn').addEventListener('click', () => {
            const activeNodes = nodes.filter(n=>n.active);
            if(activeNodes.length === 0) {
                // revive all
                Object.assign(nodes, nodes.map(n => ({...n, active: true})));
                showToast('Control Plane revived all nodes.', 'success');
                document.getElementById('k8sKillNodeBtn').innerText = 'Kill Random Node';
                document.getElementById('k8sKillNodeBtn').style.color = 'var(--red)';
            } else {
                const target = activeNodes[Math.floor(Math.random() * activeNodes.length)];
                target.active = false;
                showToast(`Node ${target.name} crashed! Pods rescheduling...`, 'error');
                if(nodes.filter(n=>n.active).length === 0) {
                    document.getElementById('k8sKillNodeBtn').innerText = 'Revive Nodes';
                    document.getElementById('k8sKillNodeBtn').style.color = 'var(--green)';
                }
            }
            renderNodes();
        });
    }

    // Dummy architecture canvas draw 
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