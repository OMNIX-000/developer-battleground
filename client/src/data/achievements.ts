import type { Achievement } from '@/types'

export const achievements: Achievement[] = [
  { title: 'FIRST DEPLOYMENT', description: 'Deployed a build to a live hosting platform for the first time.', icon: 'rocket', xpReward: 500, unlocked: true },
  { title: 'FIRST PROJECT', description: 'Completed your first standalone programming project.', icon: 'terminal', xpReward: 500, unlocked: true },
  { title: 'WEB DEVELOPER', description: 'Mastered the fundamentals of building for the web.', icon: 'globe', xpReward: 750, unlocked: true },
  { title: 'MACHINE LEARNING OPERATOR', description: 'Trained and shipped a machine learning model.', icon: 'brain', xpReward: 1000, unlocked: true },
  { title: 'FULL STACK DEVELOPER', description: 'Delivered a project spanning frontend, backend and database.', icon: 'layers', xpReward: 1200, unlocked: true },
  { title: 'DSA WARRIOR', description: 'Strengthened problem-solving with data structures and algorithms.', icon: 'sword', xpReward: 800, unlocked: true },
  { title: 'PROJECT COMMANDER', description: 'Led a major feature or project from idea to completion.', icon: 'command', xpReward: 1000, unlocked: true },
  { title: 'CERTIFIED DEVELOPER', description: 'Earned recognition through certifications and credentials.', icon: 'medal', xpReward: 900, unlocked: false },
]

export const TOTAL_XP = achievements.reduce((sum, a) => sum + a.xpReward, 0)