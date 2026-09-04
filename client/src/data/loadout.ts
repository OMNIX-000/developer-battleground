export interface SkillStat {
  name: string
  percentage: number
}

export const skillStats: SkillStat[] = [
  { name: 'WEB DEVELOPMENT', percentage: 90 },
  { name: 'PYTHON', percentage: 90 },
  { name: 'REACT', percentage: 92 },
  { name: 'MACHINE LEARNING', percentage: 80 },
  { name: 'BACKEND DEVELOPMENT', percentage: 85 },
  { name: 'DSA', percentage: 80 },
  { name: 'JAVA', percentage: 75 },
  { name: 'C PROGRAMMING', percentage: 80 },
]

export interface JourneyLocation {
  id: string
  name: string
  description: string
  learned: string[]
  technologies: string[]
  projects: string[]
  progress: number
  year: string
  x: number // map coords 0-100
  y: number
}

export const journeyLocations: JourneyLocation[] = [
  {
    id: 'start',
    name: 'STARTING ZONE',
    description: 'Where the journey began — first lines of code and the spark of curiosity.',
    learned: ['Basic programming logic', 'Problem decomposition', 'Computational thinking'],
    technologies: ['Editor fundamentals', 'Command line basics'],
    projects: ['First programs, loops and conditionals'],
    progress: 100,
    year: 'BEGIN',
    x: 8,
    y: 82,
  },
  {
    id: 'c-base',
    name: 'C PROGRAMMING BASE',
    description: 'Mastered the foundations of systems-level programming.',
    learned: ['Pointers and memory management', 'Structured programming', 'Algorithm implementation'],
    technologies: ['C', 'GCC'],
    projects: ['Data structure implementations'],
    progress: 80,
    year: 'PHASE 1',
    x: 20,
    y: 60,
  },
  {
    id: 'java-area',
    name: 'JAVA TRAINING AREA',
    description: 'Object-oriented discipline and application architecture.',
    learned: ['OOP principles', 'Collections framework', 'Exception handling'],
    technologies: ['Java', 'JVM'],
    projects: ['OOP-based applications'],
    progress: 75,
    year: 'PHASE 2',
    x: 34,
    y: 70,
  },
  {
    id: 'python-lab',
    name: 'PYTHON LAB',
    description: 'Entered the world of scripting, data and AI.',
    learned: ['Scripting and automation', 'Data manipulation', 'ML prerequisites'],
    technologies: ['Python', 'NumPy', 'Pandas'],
    projects: ['Data analysis scripts', 'Automation tools'],
    progress: 90,
    year: 'PHASE 3',
    x: 48,
    y: 42,
  },
  {
    id: 'web-city',
    name: 'WEB DEVELOPMENT CITY',
    description: 'Built entire applications from browser to server.',
    learned: ['Frontend architecture', 'API design', 'Responsive UI'],
    technologies: ['React', 'Node.js', 'Express.js', 'Tailwind CSS', 'TypeScript'],
    projects: ['Full-stack web apps'],
    progress: 90,
    year: 'PHASE 4',
    x: 64,
    y: 58,
  },
  {
    id: 'ml-lab',
    name: 'MACHINE LEARNING LAB',
    description: 'Applied AI to real-world prediction problems.',
    learned: ['Supervised learning', 'Feature engineering', 'Model evaluation'],
    technologies: ['Python', 'Scikit-learn', 'ML pipelines'],
    projects: ['Stock Market Prediction'],
    progress: 80,
    year: 'PHASE 5',
    x: 78,
    y: 34,
  },
  {
    id: 'fullstack-arena',
    name: 'FULL STACK ARENA',
    description: 'Unified frontend, backend, database and ML into one system.',
    learned: ['System integration', 'DevOps fundamentals', 'Production deployment'],
    technologies: ['React', 'Node.js', 'MongoDB', 'Express.js', 'ML'],
    projects: ['Stock Market Prediction', 'Developer Battleground'],
    progress: 85,
    year: 'PHASE 6',
    x: 88,
    y: 50,
  },
  {
    id: 'future',
    name: 'FUTURE TERRITORY',
    description: 'The next deployment — advanced AI systems and scalable full-stack architecture.',
    learned: ['Deep learning', 'Cloud-native architecture', 'System design at scale'],
    technologies: ['LangChain', 'AWS', 'Kubernetes', 'Advanced AI'],
    projects: ['AI products', 'Scalable platforms'],
    progress: 20,
    year: 'NEXT',
    x: 94,
    y: 20,
  },
]

export interface LoadoutSkill {
  name: string
  level: number
  xp: number
  description: string
  relatedProjects: string[]
}

export interface LoadoutSlot {
  id: string
  slotName: string
  icon: string
  skill: LoadoutSkill
}

export const loadoutSlots: LoadoutSlot[] = [
  {
    id: 'primary',
    slotName: 'PRIMARY SKILL',
    icon: 'crosshair',
    skill: {
      name: 'FULL STACK DEVELOPMENT',
      level: 9,
      xp: 7850,
      description: 'End-to-end delivery capability across client, server, database and ML services.',
      relatedProjects: ['Stock Market Prediction', 'Developer Battleground'],
    },
  },
  {
    id: 'secondary',
    slotName: 'SECONDARY SKILL',
    icon: 'target',
    skill: {
      name: 'MACHINE LEARNING',
      level: 8,
      xp: 6400,
      description: 'Practical experience training and deploying predictive models for real data.',
      relatedProjects: ['Stock Market Prediction'],
    },
  },
  {
    id: 'special',
    slotName: 'SPECIAL ABILITY',
    icon: 'zap',
    skill: {
      name: 'PROBLEM SOLVING',
      level: 9,
      xp: 8000,
      description: 'A strong command of DSA enabling efficient, elegant solutions under pressure.',
      relatedProjects: ['Competitive programming', 'Optimization tasks'],
    },
  },
  {
    id: 'tools',
    slotName: 'TOOLS',
    icon: 'wrench',
    skill: {
      name: 'TOOLKIT',
      level: 8,
      xp: 7000,
      description: 'React, Node.js, Python, MongoDB, Git, VS Code and the modern dev arsenal.',
      relatedProjects: ['All missions'],
    },
  },
]

export interface LoadoutCategory {
  id: string
  label: string
  icon: string
  items: string[]
}

export const loadoutCategories: LoadoutCategory[] = [
  { id: 'tools', label: 'TOOLS', icon: 'wrench', items: ['React', 'Node.js', 'Python', 'MongoDB', 'Git', 'VS Code'] },
  { id: 'languages', label: 'LANGUAGES', icon: 'file-code', items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C'] },
  { id: 'ai', label: 'AI SYSTEMS', icon: 'brain', items: ['Machine Learning', 'Artificial Intelligence', 'Data Analysis'] },
  { id: 'devops', label: 'DEPLOYMENT', icon: 'cloud', items: ['Git', 'GitHub', 'Vercel', 'Render'] },
]