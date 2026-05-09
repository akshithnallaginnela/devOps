const DevOpsData = {
    pipelineStages: [
        { id: 'code', name: 'Code', icon: 'code', tools: ['Git', 'GitHub', 'GitLab'], desc: 'Developers write code and push to a version control repository.', best: ['Use branch protections', 'Write descriptive commits'], code: `git commit -m "feat: login API"` },
        { id: 'build', name: 'Build', icon: 'build', tools: ['Maven', 'NPM', 'Docker'], desc: 'Source code is compiled and dependencies are resolved. A deployable artifact is created.', best: ['Use multi-stage builds', 'Cache dependencies'], code: `npm ci && npm run build` },
        { id: 'test', name: 'Test', icon: 'science', tools: ['JUnit', 'Jest', 'Selenium'], desc: 'Automated tests (unit, integration) run to ensure code quality.', best: ['Fail fast', 'Maintain high coverage'], code: `npm run test -- --coverage` },
        { id: 'scan', name: 'Security Scan', icon: 'security', tools: ['SonarQube', 'Trivy', 'Snyk'], desc: 'Static Application Security Testing (SAST) checks for vulnerabilities.', best: ['Block pipeline on critical CVEs'], code: `docker run --rm -v $(pwd):/app aquasec/trivy fs /app` },
        { id: 'stage', name: 'Stage', icon: 'layers', tools: ['Terraform', 'Ansible'], desc: 'Deploying to a pre-production environment mimicking production.', best: ['Use IaC for environments', 'Do load testing here'], code: `terraform apply -auto-approve` },
        { id: 'deploy', name: 'Deploy', icon: 'rocket_launch', tools: ['ArgoCD', 'K8s', 'AWS'], desc: 'Releasing the tested application to production users.', best: ['Blue/Green deployments', 'Automate rollbacks'], code: `kubectl apply -f deployment.yaml` },
        { id: 'monitor', name: 'Monitor', icon: 'monitoring', tools: ['Prometheus', 'Grafana', 'ELK'], desc: 'Observing application health, logs, and performance in real-time.', best: ['Set up alerts', 'Log structured JSON'], code: `curl http://metrics-endpoint:9090` }
    ],
    dockerCmds: [
        { cmd: 'docker build -t app:v1 .', desc: 'Build an image from a Dockerfile' },
        { cmd: 'docker run -d -p 80:80 app:v1', desc: 'Run a container in detached mode mapping port 80' },
        { cmd: 'docker ps', desc: 'List running containers' },
        { cmd: 'docker stop <id>', desc: 'Stop a running container' }
    ],
    roadmap: [
        { id: 'r1', title: 'Linux Basics & Shell', desc: 'Navigate the terminal, manage files, write bash scripts.', tags: ['Bash', 'Permissions', 'SSH'], time: '1 Week' },
        { id: 'r2', title: 'Version Control', desc: 'Track changes and collaborate using Git.', tags: ['Git', 'GitHub', 'Branching'], time: '1 Week' },
        { id: 'r3', title: 'Networking & Security', desc: 'HTTP, DNS, SSL/TLS, Firewalls.', tags: ['TCP/IP', 'Certs', 'VPC'], time: '2 Weeks' },
        { id: 'r4', title: 'CI/CD Pipelines', desc: 'Automate build and deployment process.', tags: ['Jenkins', 'GitHub Actions'], time: '2 Weeks' },
        { id: 'r5', title: 'Containers (Docker)', desc: 'Package applications and dependencies.', tags: ['Docker', 'Dockerfile', 'Compose'], time: '2 Weeks' },
        { id: 'r6', title: 'Kubernetes', desc: 'Container orchestration at scale.', tags: ['K8s', 'Pods', 'Helm'], time: '3 Weeks' },
        { id: 'r7', title: 'Infrastructure as Code', desc: 'Provision cloud resources via code.', tags: ['Terraform', 'Ansible'], time: '2 Weeks' },
        { id: 'r8', title: 'Monitoring & Logging', desc: 'Observe system health.', tags: ['Prometheus', 'Grafana', 'ELK'], time: '1 Week' }
    ],
    learningTracks: [
        {
            id: 'foundation',
            title: 'Foundation Track',
            subtitle: 'Start from zero and build core confidence',
            focus: ['Linux Shell', 'Git Basics', 'Docker Basics'],
            weeklyGoal: 5
        },
        {
            id: 'platform',
            title: 'Platform Engineer Track',
            subtitle: 'Automate infrastructure and deployments',
            focus: ['CI/CD Pipelines', 'Kubernetes', 'Terraform'],
            weeklyGoal: 7
        },
        {
            id: 'sre',
            title: 'SRE Track',
            subtitle: 'Reliability, observability, and incident response',
            focus: ['Monitoring', 'SLIs/SLOs', 'Runbooks'],
            weeklyGoal: 6
        }
    ],
    challenges: [
        {
            id: 'linux-basics',
            title: 'Linux Warm-up',
            difficulty: 'Beginner',
            instructions: 'Run mkdir projects, cd projects, echo "hello devops" > note.txt, then cat note.txt',
            requiredCommands: ['mkdir', 'cd', 'echo', 'cat']
        },
        {
            id: 'git-fastlane',
            title: 'Git Quick Cycle',
            difficulty: 'Beginner',
            instructions: 'Open Version Control and review commit → branch strategy notes.',
            requiredActions: ['visit-git']
        },
        {
            id: 'monitoring-watch',
            title: 'Observe Live Metrics',
            difficulty: 'Intermediate',
            instructions: 'Open Monitoring, keep logs running, and identify at least one WARN/ERROR event.',
            requiredActions: ['visit-monitoring', 'observe-log-alert']
        }
    ],
    conceptGlossary: [
        { keyword: 'ci', label: 'Continuous Integration', target: 'cicd' },
        { keyword: 'cd', label: 'Continuous Delivery / Deployment', target: 'cicd' },
        { keyword: 'docker', label: 'Docker Containers', target: 'docker' },
        { keyword: 'kubernetes', label: 'Kubernetes', target: 'k8s' },
        { keyword: 'terraform', label: 'Infrastructure as Code', target: 'iac' },
        { keyword: 'monitoring', label: 'Monitoring & Logs', target: 'monitoring' },
        { keyword: 'git', label: 'Version Control', target: 'git' },
        { keyword: 'linux', label: 'Hands-on Labs', target: 'labs' },
        { keyword: 'roadmap', label: 'Learning Roadmap', target: 'roadmap' }
    ]
};
