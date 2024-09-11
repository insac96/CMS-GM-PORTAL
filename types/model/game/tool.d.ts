import type { Types } from 'mongoose'

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

export interface IDBGameToolPayment {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  game: Types.ObjectId | IDBGameTool

  recharge: boolean
  mail: boolean

  coin: number
}