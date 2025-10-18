// Questions will be loaded dynamically from individual category files
let questions = {};
let questionsLoaded = false;

// Challenges will be loaded dynamically from individual challenge files
let challenges = [];
let challengesLoaded = false;

    // Category file mapping
    const categoryFiles = {
        'linux': 'Random-Questions/linux.md',
        'networking': 'Random-Questions/networking.md',
        'git': 'Random-Questions/git.md',
        'aws': 'Random-Questions/aws.md',
        'azure': 'Random-Questions/azure.md',
        'cloud': ['Random-Questions/aws.md', 'Random-Questions/azure.md'], // Special case: multiple files
        'terraform': 'Random-Questions/terraform.md',
        'docker': 'Random-Questions/docker.md',
        'kubernetes': 'Random-Questions/kubernetes.md',
        'config-management': 'Random-Questions/config-management.md',
        'cicd': 'Random-Questions/cicd.md',
        'devops': 'Random-Questions/devops.md',
        'system-design': 'Random-Questions/system-design.md',
        'security': 'Random-Questions/security.md'
    };

// Challenge file mapping
const challengeFiles = {
    'devops': 'Challenge/devops-challenges.md',
    'sre': 'Challenge/SRE-challenge.md',
    'aws': 'Challenge/aws-challenge.md',
    'kubernetes': 'Challenge/kubernetes-challenge.md'
};

// Fetch and parse questions from individual category files
async function loadQuestionsFromReadme() {
    try {
        questions = {};
        let totalQuestions = 0;
        
        // Load each category file
        for (const [category, filePath] of Object.entries(categoryFiles)) {
            try {
                // Handle special case where category maps to multiple files (like 'cloud')
                if (Array.isArray(filePath)) {
                    questions[category] = [];
                    for (const path of filePath) {
                        const response = await fetch(path);
                        if (response.ok) {
                            const content = await response.text();
                            const categoryQuestions = parseQuestionsFromContent(content, category);
                            questions[category] = questions[category].concat(categoryQuestions);
                            totalQuestions += categoryQuestions.length;
                            console.log(`Loaded ${categoryQuestions.length} questions from ${path} for ${category}`);
                        } else {
                            console.warn(`Failed to load ${path}: ${response.status}`);
                        }
                    }
                } else {
                    // Single file case
                    const response = await fetch(filePath);
                    if (response.ok) {
                        const content = await response.text();
                        const categoryQuestions = parseQuestionsFromContent(content, category);
                        questions[category] = categoryQuestions;
                        totalQuestions += categoryQuestions.length;
                        console.log(`Loaded ${categoryQuestions.length} questions from ${filePath}`);
                    } else {
                        console.warn(`Failed to load ${filePath}: ${response.status}`);
                        questions[category] = [];
                    }
                }
            } catch (error) {
                console.error(`Error loading ${filePath}:`, error);
                questions[category] = [];
            }
        }
        
        // Check if we have any valid questions
        const hasValidQuestions = totalQuestions > 0;
        
        if (!hasValidQuestions) {
            // Use fallback questions if no valid questions found
            questions = getFallbackQuestions();
            console.log('Using fallback questions - no valid questions found in category files');
        }
        
        questionsLoaded = true;
        console.log(`Total questions loaded: ${totalQuestions} across ${Object.keys(questions).length} categories`);
        return hasValidQuestions;
    } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback to a basic set of questions
        questions = getFallbackQuestions();
        questionsLoaded = true;
        return false;
    }
}

// Fetch and parse challenges from individual challenge files
async function loadChallengesFromReadme() {
    try {
        challenges = [];
        let totalChallenges = 0;
        
        // Load each challenge file
        for (const [category, filePath] of Object.entries(challengeFiles)) {
            try {
                const response = await fetch(filePath);
                if (response.ok) {
                    const content = await response.text();
                    const categoryChallenges = parseChallengesFromContent(content, category);
                    challenges = challenges.concat(categoryChallenges);
                    totalChallenges += categoryChallenges.length;
                    console.log(`Loaded ${categoryChallenges.length} challenges from ${filePath}`);
                } else {
                    console.warn(`Failed to load ${filePath}: ${response.status}`);
                }
            } catch (error) {
                console.error(`Error loading ${filePath}:`, error);
            }
        }
        
        // Check if we have any valid challenges
        const hasValidChallenges = totalChallenges > 0;
        
        if (!hasValidChallenges) {
            // Use fallback challenges if no valid challenges found
            challenges = getFallbackChallenges();
            console.log('Using fallback challenges - no valid challenges found in challenge files');
        }
        
        challengesLoaded = true;
        console.log(`Total challenges loaded: ${totalChallenges} from ${Object.keys(challengeFiles).length} challenge files`);
        
        // Debug: Check if any challenge has multiple challenges in content
        challenges.forEach((challenge, index) => {
            if (challenge.content.includes('## ') && challenge.content.includes('Scenario:')) {
                console.warn(`Challenge ${index + 1} (${challenge.title}) seems to contain multiple challenges!`);
            }
        });
        
        return hasValidChallenges;
    } catch (error) {
        console.error('Error loading challenges:', error);
        // Fallback to a basic set of challenges
        challenges = getFallbackChallenges();
        challengesLoaded = true;
        return false;
    }
}

// Parse challenges from challenge file content
function parseChallengesFromContent(content, category) {
    const challenges = [];
    const lines = content.split('\n');
    
    let currentChallenge = null;
    let challengeContent = [];
    let inChallengeSection = false;
    
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Look for challenge headers with different formats
        const challengeMatch = line.match(/^## (\d+)\.\s+(.+)$/);
        if (challengeMatch) {
            // Save previous challenge if exists
            if (currentChallenge && challengeContent.length > 0) {
                currentChallenge.content = challengeContent.join('\n').trim();
                challenges.push(currentChallenge);
            }
            
            const [, number, titleWithDifficulty] = challengeMatch;
            
            // Extract title and difficulty
            let title, difficulty;
            const difficultyMatch = titleWithDifficulty.match(/^(.+?)\s*\(([^)]+)\)$/);
            if (difficultyMatch) {
                title = difficultyMatch[1].trim();
                difficulty = difficultyMatch[2].trim();
            } else {
                // Just use the title as is, difficulty will be found in content or default to Basic
                title = titleWithDifficulty.trim();
                difficulty = 'Basic'; // Default, will be updated if found in content
            }
            
            // Start new challenge
            currentChallenge = {
                title: title,
                difficulty: difficulty,
                category: category,
                content: ''
            };
            challengeContent = [];
            inChallengeSection = true;
            continue;
        }
        
        // Skip non-challenge headers and table of contents
        if (line.startsWith('## ') && !challengeMatch) {
            // This is a section header, not a challenge
            continue;
        }
        
        // Collect content for current challenge
        if (inChallengeSection && currentChallenge) {
            // Look for difficulty markers in content
            const difficultyMatch = line.match(/^\*\*Difficulty\*\*:\s*(.+)$/);
            if (difficultyMatch) {
                currentChallenge.difficulty = difficultyMatch[1].trim();
                continue;
            }
            
            // Stop collecting when we hit the end of challenges section
            if (line.startsWith('Go to the top of the page link') ||
                line.startsWith('[Top](#devops-challenges)') ||
                line.startsWith('## 41.') ||
                line.startsWith('## 42.') ||
                line.startsWith('## Contributing') ||
                line.startsWith('## License') ||
                line.startsWith('*More challenges coming soon!')) {
                // Save current challenge and stop
                if (challengeContent.length > 0) {
                    currentChallenge.content = challengeContent.join('\n').trim();
                    challenges.push(currentChallenge);
                }
                break;
            }
            
            // Skip solution links and empty lines at the beginning
            if (line.startsWith('Solution here >>') ||
                (challengeContent.length === 0 && line === '')) {
                continue;
            }
            
            // Add content line
            if (line || challengeContent.length > 0) {
                challengeContent.push(lines[i]);
            }
        }
    }
    
    // Don't forget the last challenge
    if (currentChallenge && challengeContent.length > 0) {
        currentChallenge.content = challengeContent.join('\n').trim();
        challenges.push(currentChallenge);
    }
    
    return challenges;
}

// Extract difficulty from title when not in parentheses
function extractDifficultyFromTitle(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('advanced')) return 'Advanced';
    if (titleLower.includes('basic')) return 'Basic';
    
    return 'Intermediate';
}



// Format content for HTML display
function formatContentForDisplay(content) {
    if (!content) return '';
    
    let formatted = content;
    
    // Convert markdown code blocks to HTML pre blocks (do this first)
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Convert inline code to HTML code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Convert markdown bold to HTML bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert markdown headers to HTML headers
    formatted = formatted.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    
    // Convert markdown lists to HTML lists
    formatted = formatted.replace(/^- (.*$)/gm, '<li>$1</li>');
    
    // Wrap consecutive list items in ul tags
    formatted = formatted.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    // Convert line breaks to HTML breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Clean up multiple line breaks
    formatted = formatted.replace(/(<br>\s*){3,}/g, '<br><br>');
    
    // Clean up line breaks around HTML elements
    formatted = formatted.replace(/<br>\s*(<h[2-3]>)/g, '$1');
    formatted = formatted.replace(/(<\/h[2-3]>)\s*<br>/g, '$1');
    formatted = formatted.replace(/<br>\s*(<ul>)/g, '$1');
    formatted = formatted.replace(/(<\/ul>)\s*<br>/g, '$1');
    formatted = formatted.replace(/<br>\s*(<pre>)/g, '$1');
    formatted = formatted.replace(/(<\/pre>)\s*<br>/g, '$1');
    
    return formatted;
}

// Extract category from challenge title
function extractCategoryFromTitle(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('k8s') || titleLower.includes('kubernetes')) return 'Kubernetes';
    if (titleLower.includes('terraform')) return 'Terraform';
    if (titleLower.includes('docker')) return 'Docker';
    if (titleLower.includes('ansible')) return 'Config Management';
    if (titleLower.includes('aws')) return 'AWS';
    if (titleLower.includes('azure')) return 'Azure';
    if (titleLower.includes('gcp')) return 'GCP';
    if (titleLower.includes('security')) return 'Security';
    if (titleLower.includes('monitoring')) return 'Monitoring';
    if (titleLower.includes('linux')) return 'Linux';
    if (titleLower.includes('helm')) return 'Helm';
    if (titleLower.includes('vault')) return 'Vault';
    if (titleLower.includes('chaos')) return 'Chaos Engineering';
    if (titleLower.includes('cicd') || titleLower.includes('pipeline')) return 'CI/CD';
    if (titleLower.includes('network')) return 'Networking';
    if (titleLower.includes('bash') || titleLower.includes('script')) return 'Scripting';
    if (titleLower.includes('puppet')) return 'Puppet';
    if (titleLower.includes('packer')) return 'Packer';
    if (titleLower.includes('istio')) return 'Istio';
    if (titleLower.includes('opa')) return 'OPA';
    if (titleLower.includes('argocd')) return 'ArgoCD';
    if (titleLower.includes('traefik')) return 'Traefik';
    if (titleLower.includes('tilt')) return 'Tilt';
    
    return 'DevOps';
}

// Fallback challenges if loading fails
function getFallbackChallenges() {
    return [
        {
            title: "K8s Deployment Challenge",
            content: "Complete the Kubernetes deployment file to create a namespace 'CyberCo', deploy Redis with 'buster' tag, scale to 2 replicas, and expose port 6379.",
            difficulty: "Basic",
            category: "Kubernetes"
        },
        {
            title: "Linux Automation Challenge",
            content: "Write a script to extract backup.tar.gz, set permissions (0664 for files, 0775 for directories), change ownership to 'anonymous:no-team', and create fixed-archive.tar.gz.",
            difficulty: "Intermediate",
            category: "Linux"
        }
    ];
}

// Parse questions from README content
function parseQuestionsFromContent(content, category) {
    const questions = [];
    
    const lines = content.split('\n');
    let currentQuestion = null;
    let inDetails = false;
    let questionContent = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Detect question start
        if (line === '<details>') {
            inDetails = true;
            questionContent = [];
        }
        
        // Detect question title
        if (inDetails && line.startsWith('<summary>') && line.endsWith('</summary>')) {
            const title = line.replace('<summary>', '').replace('</summary>', '');
            currentQuestion = { title, content: '', category: category };
        }
        
        // Collect question content
        if (inDetails && currentQuestion && !line.startsWith('<summary>') && !line.startsWith('<details>') && !line.startsWith('</details>')) {
            if (line.trim()) {
                questionContent.push(line);
            }
        }
        
        // Detect question end
        if (line === '</details>' && currentQuestion) {
            currentQuestion.content = questionContent.join('\n').trim();
            // Skip questions with placeholder content
            if (currentQuestion.content && currentQuestion.content !== 'Answer goes here') {
                questions.push({
                    title: currentQuestion.title,
                    content: currentQuestion.content,
                    category: getCategoryDisplayName(category)
                });
            }
            currentQuestion = null;
            inDetails = false;
            questionContent = [];
        }
    }
    
    return questions;
}


// Get category display name
function getCategoryDisplayName(category) {
    const displayNames = {
        linux: 'Linux 🐧',
        networking: 'Networking 🌐',
        git: 'Git',
        aws: 'AWS 🌩️',
        azure: 'Azure 🌩️',
        cloud: 'Cloud ☁️',
        terraform: 'Terraform 🏗️',
        docker: 'Docker 🐳',
        kubernetes: 'Kubernetes 🎻',
        'config-management': 'Config Management 🔧',
        cicd: 'CI/CD 🔄',
        devops: 'DevOps 🛠',
        'system-design': 'System Design 🍥',
        security: 'Security 🔒'
    };
    return displayNames[category] || category;
}

// Fallback questions in case README can't be loaded
function getFallbackQuestions() {
    return {
        linux: [
            {
                title: "What is Linux?",
                content: "Linux is an open-source operating system based on the UNIX architecture. It was created by Linus Torvalds in 1991.",
                category: "Linux 🐧"
            }
        ],
        networking: [
            {
                title: "What is a network protocol?",
                content: "A network protocol is a set of rules and standards that govern how data is transmitted and received over a network.",
                category: "Networking 🌐"
            }
        ],
        git: [
            {
                title: "What is Git?",
                content: "Git is a distributed version control system that is widely used for tracking changes in source code during software development.",
                category: "Git"
            }
        ],
        aws: [
            {
                title: "What is AWS?",
                content: "AWS (Amazon Web Services) is a comprehensive cloud computing platform provided by Amazon.",
                category: "AWS 🌩️"
            }
        ],
        terraform: [
            {
                title: "What is Terraform?",
                content: "Terraform is an open-source infrastructure as code (IaC) tool developed by HashiCorp.",
                category: "Terraform 🏗️"
            }
        ],
        docker: [
            {
                title: "What is Docker?",
                content: "Docker is a platform that allows you to develop, ship, and run applications in containers.",
                category: "Docker 🐳"
            },
            {
                title: "What is a container and what are its fundamentals?",
                content: "Containers are packages of software that contain all of the necessary elements to run in any environment. In this way, containers virtualize the operating system and run anywhere, from a private data center to the public cloud or even on a developer's personal machine.",
                category: "Docker 🐳"
            },
            {
                title: "What are c-groups and namespaces in Linux?",
                content: "Control groups (cgroups) allow administrators to allocate resources — such as CPU time, system memory, network bandwidth, or combinations of these resources — among user-defined groups of tasks (processes) running on a system. Namespaces wrap a global system resource in an abstraction that makes it appear to the processes within the namespace that they have their own isolated instance of the global resource.",
                category: "Docker 🐳"
            }
        ],
        kubernetes: [
            {
                title: "What is Kubernetes?",
                content: "Kubernetes (K8s) is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. It provides a framework for running distributed systems resiliently.",
                category: "Kubernetes 🎻"
            },
            {
                title: "What problems does Kubernetes solve?",
                content: "Kubernetes solves problems like: container orchestration, service discovery, load balancing, storage orchestration, automated rollouts and rollbacks, secret and configuration management, and horizontal scaling.",
                category: "Kubernetes 🎻"
            },
            {
                title: "What is a Pod and what does it do?",
                content: "A Pod is the smallest deployable unit in Kubernetes. It represents a single instance of a running process in your cluster and can contain one or more containers that share storage, network, and specifications for how to run the containers.",
                category: "Kubernetes 🎻"
            }
        ],
        devops: [
            {
                title: "What is DevOps?",
                content: "DevOps is a set of practices that combines software development (Dev) and IT operations (Ops).",
                category: "DevOps 🛠"
            }
        ],
        cicd: [],
        cloud: [
            {
                title: "What is cloud computing?",
                content: "Cloud computing is the delivery of computing services including servers, storage, databases, networking, software, analytics, and intelligence over the Internet (the cloud) to offer faster innovation, flexible resources, and economies of scale.",
                category: "Cloud ☁️"
            }
        ],
        'config-management': [
            {
                title: "What is configuration management?",
                content: "Configuration management is the process of systematically handling changes to a system in a way that it maintains integrity over time. It involves tracking and controlling changes to software, hardware, and documentation.",
                category: "Config Management 🔧"
            }
        ],
        security: [
            {
                title: "What is cybersecurity?",
                content: "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information.",
                category: "Security 🔒"
            }
        ]
    };
}

// Challenges are now loaded dynamically from base-location/devops-challenges/README.md

// Get all questions as a flat array
function getAllQuestions() {
    return Object.values(questions).flat();
}

// Get random question from selected categories with session-based tracking
function getRandomQuestion(selectedCategories = null) {
    let questionsToChooseFrom;
    
    if (selectedCategories && selectedCategories.length > 0) {
        // Get questions from selected categories only
        questionsToChooseFrom = [];
        selectedCategories.forEach(category => {
            if (questions[category]) {
                questionsToChooseFrom = questionsToChooseFrom.concat(questions[category]);
            }
        });
    } else {
        // Get all questions if no categories selected
        questionsToChooseFrom = getAllQuestions();
    }
    
    if (questionsToChooseFrom.length === 0) {
        return null; // No questions available
    }
    
    // Get asked questions from session storage
    const askedQuestions = JSON.parse(sessionStorage.getItem('askedQuestions') || '[]');
    
    // Filter out already asked questions
    const availableQuestions = questionsToChooseFrom.filter(question => 
        !askedQuestions.includes(question.title)
    );
    
    // If all questions have been asked, reset the list and start over
    if (availableQuestions.length === 0) {
        console.log('All questions have been asked, resetting the list');
        sessionStorage.removeItem('askedQuestions');
        return questionsToChooseFrom[Math.floor(Math.random() * questionsToChooseFrom.length)];
    }
    
    // Select a random question from available questions
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    
    // Add the selected question to asked questions
    askedQuestions.push(selectedQuestion.title);
    sessionStorage.setItem('askedQuestions', JSON.stringify(askedQuestions));
    
    console.log(`Selected question: ${selectedQuestion.title}`);
    console.log(`Questions asked in this session: ${askedQuestions.length}`);
    console.log(`Total available questions: ${questionsToChooseFrom.length}`);
    
    return selectedQuestion;
}

// Get random challenge with session-based tracking
function getRandomChallenge(selectedCategories = null) {
    let challengesToChooseFrom;
    
    if (selectedCategories && selectedCategories.length > 0) {
        // Filter challenges by selected categories
        challengesToChooseFrom = challenges.filter(challenge => {
            const challengeCategory = challenge.category.toLowerCase();
            const challengeDifficulty = challenge.difficulty.toLowerCase();
            const challengeTitle = challenge.title.toLowerCase();
            
            return selectedCategories.some(selected => {
                const selectedLower = selected.toLowerCase();
                
                // Check difficulty level
                if (selectedLower === 'basic' && challengeDifficulty.includes('basic')) return true;
                if (selectedLower === 'intermediate' && challengeDifficulty.includes('intermediate')) return true;
                if (selectedLower === 'advanced' && challengeDifficulty.includes('advanced')) return true;
                
                // Check technology categories
                if (selectedLower === 'devops' && challengeCategory.includes('devops')) return true;
                if (selectedLower === 'sre' && challengeCategory.includes('sre')) return true;
                if (selectedLower === 'aws' && challengeCategory.includes('aws')) return true;
                if (selectedLower === 'kubernetes' && challengeCategory.includes('kubernetes')) return true;
                
                return false;
            });
        });
    } else {
        // Get all challenges if no categories selected
        challengesToChooseFrom = challenges;
    }
    
    if (challengesToChooseFrom.length === 0) {
        return null; // No challenges available
    }
    
    // Get asked challenges from session storage
    const askedChallenges = JSON.parse(sessionStorage.getItem('askedChallenges') || '[]');
    
    // Filter out already asked challenges
    const availableChallenges = challengesToChooseFrom.filter(challenge => 
        !askedChallenges.includes(challenge.title)
    );
    
    // If all challenges have been asked, reset the list and start over
    if (availableChallenges.length === 0) {
        console.log('All challenges have been asked, resetting the list');
        sessionStorage.removeItem('askedChallenges');
        return challengesToChooseFrom[Math.floor(Math.random() * challengesToChooseFrom.length)];
    }
    
    // Select a random challenge from available challenges
    const randomIndex = Math.floor(Math.random() * availableChallenges.length);
    const selectedChallenge = availableChallenges[randomIndex];
    
    // Add the selected challenge to asked challenges
    askedChallenges.push(selectedChallenge.title);
    sessionStorage.setItem('askedChallenges', JSON.stringify(askedChallenges));
    
    console.log(`Selected challenge: ${selectedChallenge.title}`);
    console.log(`Challenges asked in this session: ${askedChallenges.length}`);
    console.log(`Total available challenges: ${challengesToChooseFrom.length}`);
    
    return selectedChallenge;
}

// Reset session tracking (useful for testing and user control)
function resetSessionTracking() {
    sessionStorage.removeItem('askedQuestions');
    sessionStorage.removeItem('askedChallenges');
    console.log('Session tracking reset - all questions and challenges are now available again');
}

// Make resetSessionTracking available globally for testing
window.resetSessionTracking = resetSessionTracking;

// Display result
function displayResult(title, content, category = null, difficulty = null, isChallenge = false) {
    // Hide category selections when showing results
    const categorySelection = document.getElementById('categorySelection');
    const challengeCategorySelection = document.getElementById('challengeCategorySelection');
    if (categorySelection) {
        categorySelection.classList.add('hidden');
    }
    if (challengeCategorySelection) {
        challengeCategorySelection.classList.add('hidden');
    }
    
    const resultDiv = document.getElementById('result');
    const titleElement = document.getElementById('resultTitle');
    const bodyElement = document.getElementById('resultBody');
    
    titleElement.textContent = title;
    
    let bodyContent = '';
    if (category) {
        bodyContent += `<p><strong>Category:</strong> ${category}</p>`;
    }
    if (difficulty) {
        bodyContent += `<p><strong>Difficulty:</strong> ${difficulty}</p>`;
    }
    
    if (isChallenge) {
        // For challenges, show answer immediately with proper formatting
        const formattedContent = formatContentForDisplay(content);
        bodyContent += `
            <div class="question-section">
                <div class="answer-section">
                    <div class="answer-content">${formattedContent}</div>
                </div>
            </div>
        `;
    } else {
        // For random questions, show reveal button immediately
        // Wrap content in pre/code block for better formatting
        const formattedContent = `<pre><code>${content}</code></pre>`;
        bodyContent += `
            <div class="question-section">
                <div class="reveal-section">
                    <button id="revealBtn" class="btn btn-reveal">
                        <span class="btn-icon">💡</span>
                        Show Answer
                    </button>
                </div>
                <div class="answer-section hidden" id="answerSection">
                    <div class="answer-content">${formattedContent}</div>
                </div>
            </div>
        `;
    }
    
    bodyElement.innerHTML = bodyContent;
    resultDiv.classList.remove('hidden');
    
    // No countdown needed anymore - button appears immediately
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Timer functions removed - no longer needed

// Reveal answer
function revealAnswer() {
    const answerSection = document.getElementById('answerSection');
    const revealBtn = document.getElementById('revealBtn');
    
    answerSection.classList.remove('hidden');
    revealBtn.classList.add('hidden');
    
    // Scroll to answer
    answerSection.scrollIntoView({ behavior: 'smooth' });
}

// Get selected categories
function getSelectedCategories() {
    const checkboxes = document.querySelectorAll('#categorySelection input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Get selected challenge categories
function getSelectedChallengeCategories() {
    const checkboxes = document.querySelectorAll('#challengeCategorySelection input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Show category selection
function showCategorySelection() {
    const categorySelection = document.getElementById('categorySelection');
    const result = document.getElementById('result');
    
    categorySelection.classList.remove('hidden');
    result.classList.add('hidden');
    
    // Scroll to category selection
    categorySelection.scrollIntoView({ behavior: 'smooth' });
}

// Hide category selection
function hideCategorySelection() {
    const categorySelection = document.getElementById('categorySelection');
    if (categorySelection) {
        categorySelection.classList.add('hidden');
    }
}

// Show challenge category selection
function showChallengeCategorySelection() {
    const challengeCategorySelection = document.getElementById('challengeCategorySelection');
    const result = document.getElementById('result');
    
    if (challengeCategorySelection) {
        challengeCategorySelection.classList.remove('hidden');
    }
    if (result) {
        result.classList.add('hidden');
    }
}

// Hide challenge category selection
function hideChallengeCategorySelection() {
    const challengeCategorySelection = document.getElementById('challengeCategorySelection');
    if (challengeCategorySelection) {
        challengeCategorySelection.classList.add('hidden');
    }
}

// Select all categories
function selectAllCategories() {
    const checkboxes = document.querySelectorAll('#categorySelection input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = true);
}

// Deselect all categories
function deselectAllCategories() {
    const checkboxes = document.querySelectorAll('#categorySelection input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
}

// Select all challenge categories
function selectAllChallengeCategories() {
    const checkboxes = document.querySelectorAll('#challengeCategorySelection input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = true);
}

// Deselect all challenge categories
function deselectAllChallengeCategories() {
    const checkboxes = document.querySelectorAll('#challengeCategorySelection input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function() {
    // Load questions from questions&answers.md
    console.log('Loading questions from questions&answers.md...');
    const questionsSuccess = await loadQuestionsFromReadme();
    
    // Load challenges from devops-challenges.md
    console.log('Loading challenges from devops-challenges.md...');
    const challengesSuccess = await loadChallengesFromReadme();
    
    // Hide loading indicator
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
    }
    
    // Ensure category selections are hidden on page load
    const categorySelection = document.getElementById('categorySelection');
    const challengeCategorySelection = document.getElementById('challengeCategorySelection');
    if (categorySelection) {
        categorySelection.classList.add('hidden');
    }
    if (challengeCategorySelection) {
        challengeCategorySelection.classList.add('hidden');
    }
    
    if (questionsSuccess) {
        console.log('✅ Questions loaded successfully from questions&answers.md');
    } else {
        console.log('⚠️ Using fallback questions - questions&answers.md could not be loaded');
    }
    
    if (challengesSuccess) {
        console.log('✅ Challenges loaded successfully from devops-challenges.md');
    } else {
        console.log('⚠️ Using fallback challenges - devops-challenges.md could not be loaded');
    }
    
    const randomBtn = document.getElementById('randomBtn');
    const challengeBtn = document.getElementById('challengeBtn');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const deselectAllBtn = document.getElementById('deselectAllBtn');
    const getQuestionBtn = document.getElementById('getQuestionBtn');
    const selectAllChallengeBtn = document.getElementById('selectAllChallengeBtn');
    const deselectAllChallengeBtn = document.getElementById('deselectAllChallengeBtn');
    const getChallengeBtn = document.getElementById('getChallengeBtn');
    
    randomBtn.addEventListener('click', function() {
        if (!questionsLoaded) {
            alert('Questions are still loading. Please wait a moment and try again.');
            return;
        }
        showCategorySelection();
    });
    
    challengeBtn.addEventListener('click', function() {
        if (!challengesLoaded) {
            alert('Challenges are still loading. Please wait a moment and try again.');
            return;
        }
        
        // Hide other category selection and result sections first
        const categorySelection = document.getElementById('categorySelection');
        const result = document.getElementById('result');
        
        if (categorySelection) {
            categorySelection.classList.add('hidden');
        }
        if (result) {
            result.classList.add('hidden');
        }
        
        // Show challenge category selection
        showChallengeCategorySelection();
    });
    
    selectAllBtn.addEventListener('click', function() {
        selectAllCategories();
    });
    
    deselectAllBtn.addEventListener('click', function() {
        deselectAllCategories();
    });
    
    getQuestionBtn.addEventListener('click', function() {
        if (!questionsLoaded) {
            alert('Questions are still loading. Please wait a moment and try again.');
            return;
        }
        
        const selectedCategories = getSelectedCategories();
        
        if (selectedCategories.length === 0) {
            alert('Please select at least one category!');
            return;
        }
        
        const question = getRandomQuestion(selectedCategories);
        
        if (!question) {
            alert('No questions available in the selected categories!');
            return;
        }
        
        hideCategorySelection();
        displayResult(question.title, question.content, question.category, null, false);
    });
    
    // Challenge category selection event listeners
    selectAllChallengeBtn.addEventListener('click', function() {
        selectAllChallengeCategories();
    });
    
    deselectAllChallengeBtn.addEventListener('click', function() {
        deselectAllChallengeCategories();
    });
    
    getChallengeBtn.addEventListener('click', function() {
        const selectedCategories = getSelectedChallengeCategories();
        
        if (selectedCategories.length === 0) {
            alert('Please select at least one category!');
            return;
        }
        
        const challenge = getRandomChallenge(selectedCategories);
        
        if (!challenge) {
            alert('No challenges available in the selected categories!');
            return;
        }
        
        hideChallengeCategorySelection();
        displayResult(challenge.title, challenge.content, challenge.category, challenge.difficulty, true);
    });
    
    // Add event listener for reveal button (using event delegation)
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'revealBtn') {
            revealAnswer();
        }
    });
});
