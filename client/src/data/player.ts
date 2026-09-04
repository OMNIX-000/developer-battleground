export interface PlayerStats {
  name: string
  callsign: string
  role: string
  level: number
  rank: string
  xp: number
  xpRequired: number
  status: 'ONLINE' | 'OFFLINE' | 'IN MISSION'
}

export const playerStats: PlayerStats = {
  name: 'SUPRIT PANDA',
  callsign: 'PANDA-01',
  role: 'FULL STACK DEVELOPER / AI-ML ENTHUSIAST',
  level: 25,
  rank: 'ELITE DEVELOPER',
  xp: 7500,
  xpRequired: 10000,
  status: 'ONLINE',
}