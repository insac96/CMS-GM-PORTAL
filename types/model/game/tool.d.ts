import type { Types } from 'mongoose'
import type { IDBUser } from '../user'

export interface IDBGameTool {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  platform: Types.ObjectId | IDBGamePlatform
  category: Types.ObjectId | IDBGameCategory

  name: string
  short_name: string
  key: string
  description: string
  image: {
    banner: string
    logo: string
    icon: string
    review: Array<string>
  }

  content: string

  ip: string
  port: number
  mobile: boolean
  secret: string

  api: {
    start: string
    server: string
    role: string
    roles: string
    mail: string
    recharge: string
    os: string
  }

  play: {
    web: string
    windows: string
    android: string
    ios: string
  }

  price: {
    recharge: number
    mail: number
  }

  statistic: {
    play: number
    view: number
  }

  pin: boolean
  display: boolean
}

export interface IDBGameToolUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId | IDBUser
  game: Types.ObjectId | IDBGameTool

  recharge: boolean
  mail: boolean

  coin: number
}