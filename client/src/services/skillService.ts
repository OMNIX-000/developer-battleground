import api from './apiClient'
import type { Skill } from '@/types'

export const skillService = {
  async getAll(): Promise<Skill[]> {
    const res = await api.get('/skills')
    return res.data.data
  },

  async create(skill: Omit<Skill, '_id' | 'createdAt'>): Promise<Skill> {
    const res = await api.post('/skills', skill)
    return res.data.data
  },

  async update(id: string, skill: Partial<Skill>): Promise<Skill> {
    const res = await api.put(`/skills/${id}`, skill)
    return res.data.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/skills/${id}`)
  },
}