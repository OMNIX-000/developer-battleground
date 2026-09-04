export type ProjectStatus = 'completed' | 'in-progress' | 'planned'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Project {
  _id?: string
  title: string
  slug: string
  shortDescription: string
  longDescription: string
  objective: string
  problem: string
  solution: string
  architecture: string[]
  keyFeatures: string[]
  technologies: string[]
  images: string[]
  githubUrl: string
  liveUrl: string
  status: ProjectStatus
  featured: boolean
  difficulty: Difficulty
  missionNumber?: number
  createdAt?: string
  updatedAt?: string
}

export type SkillRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
export type SkillCategory = 'language' | 'frontend' | 'backend' | 'database' | 'ml' | 'tool' | 'other'

export interface Skill {
  _id?: string
  name: string
  category: SkillCategory
  level: number
  description: string
  icon: string
  rarity: SkillRarity
  createdAt?: string
}

export interface Achievement {
  _id?: string
  title: string
  description: string
  icon: string
  xpReward: number
  unlocked: boolean
  createdAt?: string
}

export type MessageStatus = 'new' | 'read' | 'archived'

export interface ContactMessage {
  _id?: string
  name: string
  email: string
  message: string
  status: MessageStatus
  createdAt?: string
}

export type UserRole = 'user' | 'admin'

export interface User {
  _id?: string
  name: string
  email: string
  role: UserRole
  createdAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}