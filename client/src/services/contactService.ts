import api from './apiClient'

export interface ContactPayload {
  name: string
  email: string
  message: string
}

export const contactService = {
  async send(payload: ContactPayload): Promise<{ message: string }> {
    const res = await api.post('/contact', payload)
    return res.data
  },
}