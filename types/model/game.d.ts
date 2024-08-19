import type { Types } from 'mongoose'

export interface IDBGamePlatform {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  name: string
  icon: string
  key: string
  display: boolean
}

export interface IDBGameCategory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  name: string
  icon: string
  key: string
  display: boolean
}

export interface IDBGame {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  platform: Types.ObjectId | IDBGamePlatform
  category: Types.ObjectId | IDBGameCategory

  name: string
  short_name: string
  key: string
  description: string
  og_image: string
  logo_image: string
  icon_image: string
  images: Array<string>

  content: string

  ip: string
  mobile: boolean
  secret: string

  api: {
    start: string
    role: string
    roles: string
    server: string
    mail: string
    recharge: string
    os: string
  }

  price: {
    recharge: number
    mail: number
    all: number
  }

  pin: boolean
  display: boolean
}