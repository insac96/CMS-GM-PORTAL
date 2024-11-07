import type { Types } from 'mongoose'
import type { IDBUser } from '../user'
import type { IDBGamePlatform, IDBGameCategory } from '../game'

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

  rate: {
    pay: number
  }

  statistic: {
    play: number
    view: number
    user: number
    revenue: number
  }

  manager: Array<Types.ObjectId>

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

  user: Types.ObjectId | IDBGameChinaUser
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

export interface IDBGameChinaComment {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId | IDBGameChinaUser
  game: Types.ObjectId | IDBGameChina
  content: string
}