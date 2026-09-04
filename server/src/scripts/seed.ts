import { connectDb, disconnectDb } from '../config/db.js'
import { Project } from '../models/Project.js'
import { Skill } from '../models/Skill.js'
import { Achievement } from '../models/Achievement.js'

const projects = [
  {
    title: 'Stock Market Prediction',
    slug: 'stock-market-prediction',
    shortDescription:
      'A full-stack web application that uses machine learning techniques to analyze stock market data and provide prediction insights.',
    longDescription:
      'Operation Stock Market Prediction is a comprehensive full-stack platform that ingests historical market data, processes it through machine learning pipelines, and serves predictive insights through an interactive dashboard.',
    objective:
      'Build a system that predicts future stock trends using machine learning, delivering actionable insights through a clean web interface.',
    problem:
      'Retail investors struggle to interpret raw market data and often lack tools that translate complex signals into clear predictions.',
    solution:
      'A unified platform combining Python-based ML pipelines with a responsive React dashboard. Models are trained server-side and forecasts are exposed through a REST API.',
    architecture: [
      'React SPA (Vite) composes the tactical command dashboard',
      'Express.js REST API brokers data between layers',
      'MongoDB stores symbols, snapshots, and prediction history',
      'Python service trains models and exposes inference endpoints',
      'Node.js orchestrates scheduled re-training via background jobs',
    ],
    keyFeatures: [
      'Interactive candlestick and trend charts',
      'Multi-model forecasting (Linear Regression, LSTM)',
      'Technical indicator overlays (MA, RSI, MACD)',
      'Confidence scoring per prediction',
      'Historical accuracy reporting',
    ],
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Python', 'Machine Learning'],
    images: [],
    githubUrl: 'https://github.com/supritpanda/stock-market-prediction',
    liveUrl: '',
    status: 'completed',
    featured: true,
    difficulty: 'hard',
    missionNumber: 1,
  },
  {
    title: 'Developer Battleground',
    slug: 'developer-battleground',
    shortDescription:
      'This very portfolio — an original tactical battle-inspired personal site built from React, Node.js, MongoDB and Three.js.',
    longDescription:
      'An original interactive portfolio inspired by tactical gaming interfaces. Every section is themed as a game system: missions, inventory, loadout, achievements and a developer journey map.',
    objective: 'Present the developer journey as an immersive game experience.',
    problem: 'Traditional portfolios fail to capture attention and communicate a developer personality.',
    solution:
      'A full-stack tactical interface with matching game systems, backed by an Express API and MongoDB.',
    architecture: ['React + Vite frontend', 'Express API', 'MongoDB via Mongoose', 'Three.js scene with WebGL fallback'],
    keyFeatures: ['Cinematic loading sequence', 'Mission and inventory systems', 'Admin command center', 'Contact transmission terminal'],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Three.js'],
    images: [],
    githubUrl: 'https://github.com/supritpanda',
    liveUrl: '',
    status: 'completed',
    featured: true,
    difficulty: 'medium',
    missionNumber: 2,
  },
]

const skills = [
  { name: 'Python', category: 'language', level: 9, description: 'Machine learning, automation, backend development and data analysis.', icon: 'python', rarity: 'EPIC' },
  { name: 'Java', category: 'language', level: 7, description: 'Object-oriented programming and application architecture.', icon: 'java', rarity: 'RARE' },
  { name: 'C', category: 'language', level: 8, description: 'Systems-level procedural programming.', icon: 'c', rarity: 'RARE' },
  { name: 'React', category: 'frontend', level: 9, description: 'Interactive component-driven user interfaces.', icon: 'react', rarity: 'EPIC' },
  { name: 'Node.js', category: 'backend', level: 9, description: 'Server-side JavaScript for scalable APIs.', icon: 'node', rarity: 'EPIC' },
  { name: 'MongoDB', category: 'database', level: 8, description: 'NoSQL document database design.', icon: 'mongodb', rarity: 'EPIC' },
  { name: 'Machine Learning', category: 'ml', level: 8, description: 'Model training, evaluation and deployment.', icon: 'brain', rarity: 'LEGENDARY' },
  { name: 'Artificial Intelligence', category: 'ml', level: 8, description: 'Applying intelligent systems to real problems.', icon: 'sparkles', rarity: 'LEGENDARY' },
  { name: 'Data Structures and Algorithms', category: 'other', level: 8, description: 'Efficient problem solving and complexity analysis.', icon: 'git-branch', rarity: 'EPIC' },
  { name: 'Git', category: 'tool', level: 8, description: 'Version control and collaborative workflows.', icon: 'git', rarity: 'RARE' },
  { name: 'GitHub', category: 'tool', level: 8, description: 'Remote repositories and open source collaboration.', icon: 'github', rarity: 'RARE' },
  { name: 'Tailwind CSS', category: 'frontend', level: 8, description: 'Utility-first responsive styling.', icon: 'wind', rarity: 'RARE' },
  { name: 'TypeScript', category: 'frontend', level: 8, description: 'Typed superset of JavaScript for scalable codebases.', icon: 'file-code', rarity: 'EPIC' },
]

const achievements = [
  { title: 'FIRST DEPLOYMENT', description: 'Deployed a build to a live hosting platform for the first time.', icon: 'rocket', xpReward: 500, unlocked: true },
  { title: 'FIRST PROJECT', description: 'Completed your first standalone programming project.', icon: 'terminal', xpReward: 500, unlocked: true },
  { title: 'WEB DEVELOPER', description: 'Mastered the fundamentals of building for the web.', icon: 'globe', xpReward: 750, unlocked: true },
  { title: 'MACHINE LEARNING OPERATOR', description: 'Trained and shipped a machine learning model.', icon: 'brain', xpReward: 1000, unlocked: true },
  { title: 'FULL STACK DEVELOPER', description: 'Delivered a project spanning frontend, backend and database.', icon: 'layers', xpReward: 1200, unlocked: true },
  { title: 'DSA WARRIOR', description: 'Strengthened problem-solving with data structures and algorithms.', icon: 'sword', xpReward: 800, unlocked: true },
  { title: 'PROJECT COMMANDER', description: 'Led a major feature or project from idea to completion.', icon: 'command', xpReward: 1000, unlocked: true },
  { title: 'CERTIFIED DEVELOPER', description: 'Earned recognition through certifications and credentials.', icon: 'medal', xpReward: 900, unlocked: false },
]

async function seed() {
  await connectDb()

  await Project.deleteMany({})
  await Skill.deleteMany({})
  await Achievement.deleteMany({})

  await Project.insertMany(projects)
  await Skill.insertMany(skills)
  await Achievement.insertMany(achievements)

  console.log('[SEED] Projects, skills and achievements inserted.')
  console.log('[SEED] Default admin must be created with: npm run create-admin (uses .env ADMIN_EMAIL / ADMIN_PASSWORD)')

  await disconnectDb()
}

seed()