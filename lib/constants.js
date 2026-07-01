export const APP_NAME = "CareerPilot AI";

export const JOB_ROLES = [
  {
    id: "software-engineer",
    label: "Software Engineer",
    requiresCoding: true,

    defaultLanguages: [
      "Java",
      "Python",
      "C++",
      "JavaScript",
    ],

    preferredDifficulty: "hard",

    codingFocus: [
      "Data Structures",
      "Algorithms",
      "Problem Solving",
      "System Design",
    ],

    subjects: [
      "Data Structures",
      "Algorithms",
      "OOP",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
      "System Design",
      "Design Patterns",
      "SQL",
      "REST APIs",
      "Git",
      "GitHub",
      "Problem Solving",
      "Behavioral",
    ],
  },

  {
    id: "frontend-developer",
    label: "Frontend Developer",
    requiresCoding: true,

    defaultLanguages: [
      "JavaScript",
      "TypeScript",
    ],

    preferredDifficulty: "medium",

    codingFocus: [
      "JavaScript",
      "DOM",
      "React",
      "Algorithms",
    ],

    subjects: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Redux",
      "Context API",
      "Responsive Design",
      "Browser APIs",
      "Web Performance",
      "Accessibility",
      "REST APIs",
      "Git",
      "DSA",
      "Behavioral",
    ],
  },

  {
    id: "backend-developer",
    label: "Backend Developer",
    requiresCoding: true,

    defaultLanguages: [
      "JavaScript",
      "Python",
      "Java",
    ],

    preferredDifficulty: "hard",

    codingFocus: [
      "Node.js",
      "API Design",
      "Database",
      "Algorithms",
    ],

    subjects: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "GraphQL",
      "Authentication",
      "Authorization",
      "JWT",
      "SQL",
      "MongoDB",
      "Redis",
      "Caching",
      "Docker",
      "Linux",
      "Microservices",
      "System Design",
      "Behavioral",
    ],
  },

  {
    id: "full-stack",
    label: "Full Stack Developer",
    requiresCoding: true,

    defaultLanguages: [
      "JavaScript",
      "TypeScript",
      "Python",
    ],

    preferredDifficulty: "hard",

    codingFocus: [
      "Frontend",
      "Backend",
      "Database",
      "Algorithms",
    ],

    subjects: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "REST APIs",
      "Authentication",
      "SQL",
      "MongoDB",
      "System Design",
      "Deployment",
      "Git",
      "Behavioral",
    ],
  },

  {
    id: "data-analyst",
    label: "Data Analyst",
    requiresCoding: true,

    defaultLanguages: [
      "Python",
      "SQL",
    ],

    preferredDifficulty: "medium",

    codingFocus: [
      "SQL",
      "Python",
      "Data Analysis",
    ],

    subjects: [
      "SQL",
      "Excel",
      "Python",
      "Pandas",
      "Statistics",
      "Power BI",
      "Tableau",
      "Data Visualization",
      "ETL",
      "Data Cleaning",
      "Business Intelligence",
      "Problem Solving",
      "Behavioral",
    ],
  },
    {
    id: "ai-engineer",
    label: "AI Engineer",
    requiresCoding: true,

    defaultLanguages: [
      "Python",
    ],

    preferredDifficulty: "hard",

    codingFocus: [
      "Machine Learning",
      "Deep Learning",
      "LLMs",
      "Python",
    ],

    subjects: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
      "NLP",
      "LLMs",
      "Prompt Engineering",
      "RAG",
      "Vector Databases",
      "Embeddings",
      "AI Agents",
      "Statistics",
      "Linear Algebra",
      "MLOps",
      "System Design",
      "Behavioral",
    ],
  },

  {
    id: "ml-engineer",
    label: "ML Engineer",
    requiresCoding: true,

    defaultLanguages: [
      "Python",
    ],

    preferredDifficulty: "hard",

    codingFocus: [
      "Machine Learning",
      "Python",
      "Optimization",
    ],

    subjects: [
      "Python",
      "Machine Learning",
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
      "Feature Engineering",
      "Model Deployment",
      "Statistics",
      "Linear Algebra",
      "Data Preprocessing",
      "Hyperparameter Tuning",
      "Model Evaluation",
      "MLOps",
      "DSA",
      "Behavioral",
    ],
  },

  {
    id: "devops",
    label: "DevOps Engineer",
    requiresCoding: true,

    defaultLanguages: [
      "Python",
      "Go",
      "Bash",
    ],

    preferredDifficulty: "hard",

    codingFocus: [
      "Automation",
      "CI/CD",
      "Infrastructure",
    ],

    subjects: [
      "Linux",
      "Docker",
      "Kubernetes",
      "Git",
      "GitHub Actions",
      "CI/CD",
      "Terraform",
      "Helm",
      "AWS",
      "Azure",
      "NGINX",
      "Prometheus",
      "Grafana",
      "Monitoring",
      "Networking",
      "Scripting",
      "Behavioral",
    ],
  },

  {
    id: "cloud-engineer",
    label: "Cloud Engineer",
    requiresCoding: true,

    defaultLanguages: [
      "Python",
      "Go",
    ],

    preferredDifficulty: "hard",

    codingFocus: [
      "Cloud",
      "Infrastructure",
      "Automation",
    ],

    subjects: [
      "AWS",
      "Azure",
      "GCP",
      "IAM",
      "VPC",
      "Load Balancing",
      "Networking",
      "Cloud Security",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Monitoring",
      "Containers",
      "Serverless",
      "Behavioral",
    ],
  },
    {
    id: "java-developer",
    label: "Java Developer",
    requiresCoding: true,

    defaultLanguages: [
      "Java",
    ],

    preferredDifficulty: "hard",

    codingFocus: [
      "Core Java",
      "Spring Boot",
      "DSA",
      "Backend Development",
    ],

    subjects: [
      "Core Java",
      "OOP",
      "Collections",
      "Exception Handling",
      "Multithreading",
      "JVM",
      "Streams API",
      "Spring Boot",
      "Spring Security",
      "Hibernate",
      "JPA",
      "JDBC",
      "Maven",
      "JUnit",
      "REST APIs",
      "SQL",
      "DSA",
      "Behavioral",
    ],
  },

  {
    id: "python-developer",
    label: "Python Developer",
    requiresCoding: true,

    defaultLanguages: [
      "Python",
    ],

    preferredDifficulty: "medium",

    codingFocus: [
      "Python",
      "Backend Development",
      "APIs",
      "Algorithms",
    ],

    subjects: [
      "Python",
      "OOP",
      "Django",
      "Flask",
      "FastAPI",
      "AsyncIO",
      "SQL",
      "REST APIs",
      "Pandas",
      "NumPy",
      "Testing",
      "Virtual Environments",
      "DSA",
      "Behavioral",
    ],
  },

  {
    id: "android-developer",
    label: "Android Developer",
    requiresCoding: true,

    defaultLanguages: [
      "Kotlin",
      "Java",
    ],

    preferredDifficulty: "medium",

    codingFocus: [
      "Android",
      "Kotlin",
      "UI",
    ],

    subjects: [
      "Kotlin",
      "Java",
      "Android SDK",
      "Jetpack Compose",
      "XML Layouts",
      "MVVM",
      "Room Database",
      "Firebase",
      "REST APIs",
      "Dependency Injection",
      "Coroutines",
      "UI/UX",
      "Behavioral",
    ],
  },

  {
    id: "ios-developer",
    label: "iOS Developer",
    requiresCoding: true,

    defaultLanguages: [
      "Swift",
    ],

    preferredDifficulty: "medium",

    codingFocus: [
      "Swift",
      "SwiftUI",
      "iOS Development",
    ],

    subjects: [
      "Swift",
      "SwiftUI",
      "UIKit",
      "Core Data",
      "Auto Layout",
      "Combine",
      "MVVM",
      "REST APIs",
      "Memory Management",
      "App Lifecycle",
      "Behavioral",
    ],
  },
    {
    id: "qa-engineer",
    label: "QA Engineer",
    requiresCoding: true,

    defaultLanguages: [
      "Java",
      "Python",
      "JavaScript",
    ],

    preferredDifficulty: "medium",

    codingFocus: [
      "Automation Testing",
      "API Testing",
      "Selenium",
    ],

    subjects: [
      "Manual Testing",
      "Automation Testing",
      "Selenium",
      "Cypress",
      "Playwright",
      "API Testing",
      "JUnit",
      "Performance Testing",
      "Load Testing",
      "Test Cases",
      "Bug Reporting",
      "Agile",
      "Behavioral",
    ],
  },

  {
    id: "cyber-security",
    label: "Cyber Security Engineer",
    requiresCoding: true,

    defaultLanguages: [
      "Python",
      "C",
      "JavaScript",
    ],

    preferredDifficulty: "hard",

    codingFocus: [
      "Security",
      "Networking",
      "Ethical Hacking",
    ],

    subjects: [
      "Network Security",
      "Cryptography",
      "Ethical Hacking",
      "OWASP Top 10",
      "Web Security",
      "Firewalls",
      "SIEM",
      "Burp Suite",
      "Wireshark",
      "Nmap",
      "Linux",
      "Incident Response",
      "Risk Assessment",
      "Behavioral",
    ],
  },

  {
    id: "database-engineer",
    label: "Database Engineer",
    requiresCoding: true,

    defaultLanguages: [
      "SQL",
      "Python",
    ],

    preferredDifficulty: "hard",

    codingFocus: [
      "SQL",
      "Database Design",
      "Query Optimization",
    ],

    subjects: [
      "SQL",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Database Design",
      "Normalization",
      "Transactions",
      "ACID Properties",
      "CAP Theorem",
      "Indexing",
      "Query Optimization",
      "Replication",
      "Sharding",
      "Backup & Recovery",
      "Behavioral",
    ],
  },

  {
    id: "network-engineer",
    label: "Network Engineer",
    requiresCoding: false,

    defaultLanguages: [],

    preferredDifficulty: "medium",

    codingFocus: [],

    subjects: [
      "TCP/IP",
      "OSI Model",
      "Routing",
      "Switching",
      "DNS",
      "DHCP",
      "VPN",
      "Firewalls",
      "Network Security",
      "Load Balancing",
      "Network Troubleshooting",
      "Behavioral",
    ],
  },
  {
  id: "network-administrator",
  label: "Network Administrator",
  requiresCoding: false,
  subjects: [
    "OSI Model",
    "TCP/IP",
    "Routing",
    "Switching",
    "VLAN",
    "Subnetting",
    "DNS",
    "DHCP",
    "NAT",
    "IPv4",
    "IPv6",
    "VPN",
    "Firewalls",
    "Network Troubleshooting",
    "Wireless Networking"
  ]
},
{
  id: "system-administrator",
  label: "System Administrator",
  requiresCoding: false,
  subjects: [
    "Windows Server",
    "Linux Administration",
    "Active Directory",
    "DNS",
    "DHCP",
    "Group Policy",
    "Virtualization",
    "VMware",
    "Hyper-V",
    "Backup and Recovery",
    "Server Security",
    "Storage Management",
    "Shell Commands",
    "Performance Monitoring"
  ]
},
{
  id: "technical-support-engineer",
  label: "Technical Support Engineer",
  requiresCoding: false,
  subjects: [
    "Computer Hardware",
    "Operating Systems",
    "Windows",
    "Linux Basics",
    "Networking Basics",
    "TCP/IP",
    "DNS",
    "DHCP",
    "Troubleshooting",
    "Printer Issues",
    "Email Configuration",
    "Remote Desktop",
    "Ticketing Systems",
    "Customer Communication"
  ]
},
{
  id: "desktop-support-engineer",
  label: "Desktop Support Engineer",
  requiresCoding: false,
  subjects: [
    "Computer Hardware",
    "Windows Installation",
    "Driver Installation",
    "Software Installation",
    "Networking Basics",
    "Virus Removal",
    "System Troubleshooting",
    "Active Directory",
    "Microsoft Office",
    "Remote Support",
    "BIOS",
    "Disk Management",
    "Windows Services"
  ]
},
{
  id: "database-administrator",
  label: "Database Administrator",
  requiresCoding: false,
  subjects: [
    "Database Concepts",
    "SQL",
    "MySQL",
    "Oracle",
    "PostgreSQL",
    "Normalization",
    "Indexing",
    "Transactions",
    "Stored Procedures",
    "Views",
    "Backup and Recovery",
    "Performance Tuning",
    "Database Security"
  ]
},
{
  id: "sql-developer",
  label: "SQL Developer",
  requiresCoding: false,
  subjects: [
    "SQL Queries",
    "Joins",
    "Subqueries",
    "Functions",
    "Views",
    "Indexes",
    "Stored Procedures",
    "Triggers",
    "Transactions",
    "Normalization",
    "Database Design",
    "Query Optimization"
  ]
},
{
  id: "qa-engineer",
  label: "QA Engineer",
  requiresCoding: false,
  subjects: [
    "Software Testing",
    "SDLC",
    "STLC",
    "Test Case Design",
    "Bug Life Cycle",
    "Regression Testing",
    "Smoke Testing",
    "Sanity Testing",
    "Agile",
    "Scrum",
    "JIRA",
    "Test Documentation"
  ]
},
{
  id: "manual-tester",
  label: "Manual Tester",
  requiresCoding: false,
  subjects: [
    "Manual Testing",
    "Test Cases",
    "Black Box Testing",
    "White Box Testing",
    "Boundary Value Analysis",
    "Equivalence Partitioning",
    "Defect Reporting",
    "Regression Testing",
    "Exploratory Testing",
    "Agile Testing",
    "JIRA"
  ]
},
{
  id: "cyber-security-analyst",
  label: "Cyber Security Analyst",
  requiresCoding: false,
  subjects: [
    "Network Security",
    "Cryptography",
    "Firewalls",
    "VPN",
    "IDS",
    "IPS",
    "SIEM",
    "OWASP Top 10",
    "Malware",
    "Phishing",
    "Incident Response",
    "Risk Assessment",
    "Authentication",
    "Authorization"
  ]
},
{
  id: "soc-analyst",
  label: "SOC Analyst",
  requiresCoding: false,
  subjects: [
    "SIEM",
    "Log Analysis",
    "Incident Response",
    "Threat Intelligence",
    "Network Security",
    "Firewalls",
    "IDS",
    "IPS",
    "Malware Analysis",
    "MITRE ATT&CK",
    "Security Monitoring",
    "Risk Management"
  ]
},
{
  id: "business-analyst",
  label: "Business Analyst",
  requiresCoding: false,
  subjects: [
    "Requirement Gathering",
    "BRD",
    "FRD",
    "User Stories",
    "Use Cases",
    "Agile",
    "Scrum",
    "UML",
    "BPMN",
    "Stakeholder Management",
    "SWOT Analysis",
    "Gap Analysis"
  ]
},
{
  id: "it-support-engineer",
  label: "IT Support Engineer",
  requiresCoding: false,
  subjects: [
    "Windows",
    "Linux Basics",
    "Networking",
    "TCP/IP",
    "DNS",
    "DHCP",
    "Printer Troubleshooting",
    "Hardware Troubleshooting",
    "Microsoft Office",
    "Email Support",
    "Active Directory",
    "Remote Assistance"
  ]
},
];
export const CODING_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Kotlin",
  "Swift",
  "Dart",
  "Scala",
  "R",
  "SQL",
];

export const INTERVIEWER_PERSONALITIES = [
  {
    id: "friendly",
    label: "Friendly",
    description: "Warm, encouraging, and supportive interviewer.",
  },
  {
    id: "professional",
    label: "Professional",
    description: "Balanced, realistic, and corporate interview style.",
  },
  {
    id: "strict",
    label: "Strict",
    description: "Challenging interviewer with follow-up questions.",
  },
];

export const INTERVIEW_RULES = [
  "Answer honestly and in your own words.",
  "Do not switch tabs during the interview.",
  "Do not copy or paste answers from external sources.",
  "Speak clearly when using voice input.",
  "Maintain eye contact with the camera whenever possible.",
  "Coding rounds are timed. Manage your time wisely.",
  "Questions are AI-generated and unique for every interview.",
  "Difficulty adapts to your selected experience level and performance.",
  "AI may ask follow-up questions based on your answers.",
  "Your communication, technical skills, confidence, and problem-solving abilities will be evaluated.",
  "A comprehensive interview report will be generated after completion.",
];

export const GROQ_MODELS = [
  {
    id: "llama-3.3-70b-versatile",
    label: "Llama 3.3 70B (Recommended)",
  },
  {
    id: "deepseek-r1-distill-llama-70b",
    label: "DeepSeek R1 Distill 70B",
  },
  {
    id: "qwen-qwq-32b",
    label: "Qwen QwQ 32B",
  },
];

export const MOCK_QUESTION_COUNT = 5;

export const CODING_QUESTION_COUNT = 2;

export const SCORE_CATEGORIES = {
  communication: [
    "Confidence",
    "Fluency",
    "Clarity",
    "Grammar",
    "Vocabulary",
    "Professionalism",
    "Listening Skills",
    "Tone",
    "Communication Effectiveness",
  ],

  technical: [
    "Technical Knowledge",
    "Concept Understanding",
    "Problem Solving",
    "Logical Thinking",
    "Accuracy",
    "Knowledge Depth",
    "Best Practices",
    "Decision Making",
  ],

  coding: [
    "Correctness",
    "Code Quality",
    "Optimization",
    "Time Complexity",
    "Space Complexity",
    "Readability",
    "Edge Cases",
    "Naming Conventions",
    "Clean Code",
    "Debugging",
  ],

  overall: [
    "Interview Readiness",
    "Confidence Level",
    "Experience Match",
    "Role Fit",
    "Hiring Probability",
    "Strengths",
    "Areas for Improvement",
    "Overall Recommendation",
  ],
};
export const EXPERIENCE_LEVELS = [
  "Fresher",
  "0-1 Years",
  "1-3 Years",
  "3-5 Years",
  "5-8 Years",
  "8+ Years",
];

export const INTERVIEW_TYPES = [
  "Technical",
  "Behavioral",
  "HR",
  "Mixed",
];

export const DIFFICULTY_LEVELS = [
  "Easy",
  "Medium",
  "Hard",
  "Expert",
];