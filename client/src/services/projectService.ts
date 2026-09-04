import api from './apiClient'
import type { Project } from '@/types'

export const projectService = {
  async getAll(params?: { featured?: boolean; status?: string }): Promise<Project[]> {
    const res = await api.get('/projects', { params })
    return res.data.data
  },

  async getBySlug(slug: string): Promise<Project> {
    const res = await api.get(`/projects/${slug}`)
    return res.data.data
  },

  async create(project: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const res = await api.post('/projects', project)
    return res.data.data
  },

  async update(id: string, project: Partial<Project>): Promise<Project> {
    const res = await api.put(`/projects/${id}`, project)
    return res.data.data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/projects/${id}`)
  },
}