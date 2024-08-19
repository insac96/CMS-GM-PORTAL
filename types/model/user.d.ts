import type { Types } from 'mongoose'
import type { IDBLevel } from './level'

export interface IDBUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  username: string
  password: string
  email: string
  phone: string
  avatar: string
  reg: {
    platform: string
  }
  social: {
    facebook: string
    zalo: string
    google: string
    tiktok: string
  }
  currency: {
    coin: number
  }
  type: number
  block: boolean
  token: string
  // Function
  save: {
    () : void
  }
}

export interface IDBUserStore {
  _id? : Types.ObjectId
  username? : string
  type?: number
  notify?: number
}