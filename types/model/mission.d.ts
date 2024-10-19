import type { Types } from 'mongoose'

export interface IDBMission {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  type: string
  coin: number
  limit: number
  expired: Date
  daily: boolean
  action: {
    game: {
      os: string
      _id: string
    }
    link: string
  }
}