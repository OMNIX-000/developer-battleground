export type ProjectStatus = 'completed' | 'in-progress' | 'planned'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type SkillRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
export type MessageStatus = 'new' | 'read' | 'archived'

// Shared API response envelope
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}