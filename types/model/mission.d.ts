import type { Types } from 'mongoose'

export interface IDBMission {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  title: string
  description: string 
  type: string
  expired: Date
  daily: boolean
  need: string,
  more: {
    game: {
      private: {
        level: number,
        power: number,
      }
    }
  },
  gift: {
    exp: number
    coin: number
    ecoin: number
  }
  display: boolean
}

export interface IDBMissionHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId
  mission: Types.ObjectId
}