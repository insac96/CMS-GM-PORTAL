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
  level: Types.ObjectId | IDBUserLevel
  reg: {
    platform: string
  }
  social: {
    facebook: string
    messenger: string
    zalo: string
    telegram: string
    tiktok: string
  }
  currency: {
    exp: number
    coin: number
  }
  china: {
    youxi: boolean
  }
  type: number
  block: boolean
  token: string
  
  // Function
  save: {
    () : void
  }
}

export interface IDBUserLevel {
  _id: Types.ObjectId
  number: number
  exp: number
  stone: number
  bonus: {
    payment: number
  }
  limit: {
    chat: number
  }
  discount: {
    shop: number
  }
}

export interface IDBUserStore {
  _id? : Types.ObjectId
  username? : string
  type?: number
  currency?: IDBUser['currency']
  level?: IDBUserLevel
  notify?: number
}