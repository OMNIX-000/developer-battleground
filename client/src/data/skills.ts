import type { Skill } from '@/types'

export const skills: Skill[] = [
  { name: 'Python', category: 'language', level: 9, description: 'Used for machine learning, automation, backend development and data analysis.', icon: 'python', rarity: 'EPIC' },
  { name: 'Java', category: 'language', level: 7, description: 'Object-oriented programming, Android foundations and enterprise applications.', icon: 'java', rarity: 'RARE' },
  { name: 'C', category: 'language', level: 8, description: 'Procedural programming and systems-level understanding.', icon: 'c', rarity: 'RARE' },
  { name: 'React', category: 'frontend', level: 9, description: 'Building interactive, component-driven user interfaces.', icon: 'react', rarity: 'EPIC' },
  { name: 'Node.js', category: 'backend', level: 9, description: 'Server-side JavaScript runtime for scalable APIs.', icon: 'node', rarity: 'EPIC' },
  { name: 'MongoDB', category: 'database', level: 8, description: 'NoSQL document database design and aggregation pipelines.', icon: 'mongodb', rarity: 'EPIC' },
  { name: 'Machine Learning', category: 'ml', level: 8, description: 'Model training, evaluation, and deployment for predictive systems.', icon: 'brain', rarity: 'LEGENDARY' },
  { name: 'Artificial Intelligence', category: 'ml', level: 8, description: 'Applying intelligent systems and algorithms to real problems.', icon: 'sparkles', rarity: 'LEGENDARY' },
  { name: 'Data Structures and Algorithms', category: 'other', level: 8, description: 'Efficient problem solving, complexity analysis and interview readiness.', icon: 'git-branch', rarity: 'EPIC' },
  { name: 'Git', category: 'tool', level: 8, description: 'Version control and collaborative workflows.', icon: 'git', rarity: 'RARE' },
  { name: 'GitHub', category: 'tool', level: 8, description: 'Remote repositories, CI/CD awareness and open source collaboration.', icon: 'github', rarity: 'RARE' },
  { name: 'Tailwind CSS', category: 'frontend', level: 8, description: 'Utility-first styling for rapid, responsive UI.', icon: 'wind', rarity: 'RARE' },
  { name: 'TypeScript', category: 'frontend', level: 8, description: 'Typed superset of JavaScript for safer, scalable codebases.', icon: 'file-code', rarity: 'EPIC' },
]

export const rarityOrder: Record<string, number> = {
  COMMON: 0,
  RARE: 1,
  EPIC: 2,
  LEGENDARY: 3,
}