import type { Types } from 'mongoose'

export interface IDBGameChina {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  platform: Types.ObjectId | IDBGamePlatform
  category: Types.ObjectId | IDBGameCategory

  name: string
  code: string
  key: string
  description: string
  image: {
    banner: string
    logo: string
    icon: string
    review: Array<string>
  }

  content: string

  play: {
    web: string
    windows: string
    android: string
    ios: string
  }

  statistic: {
    play: number
    view: number
  }

  pin: boolean
  display: boolean
}

export interface IDBGameChinaUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId | IDBUser
  game: Types.ObjectId | IDBGameChina
}

export interface IDBGameChinaPayment {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  game: Types.ObjectId | IDBGameChina
  code: string
  status: number
  coin: number
  verify: {
    person: Types.ObjectId
    time: Date
    reason: string
  }
}