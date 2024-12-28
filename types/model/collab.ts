import type { Types } from 'mongoose'

export interface IDBCollabLevel {
  _id: Types.ObjectId

  number: number
  commission: {
    game: {
      private: number
      china: number
      tool: number
    }
    vip: number
  }
}

export interface IDBCollab {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  level: Types.ObjectId
  code: string
  user: Types.ObjectId
  note: string
  view: number
  money: number
}

export interface IDBCollabStore {
  code: string
  user: Types.ObjectId
}

export interface IDBCollabNotify {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  title: string
  content: string
  pin: boolean
}

export interface IDBCollabIncome {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  collab: Types.ObjectId
  type: string
  user: Types.ObjectId
  game: Types.ObjectId
  source: Types.ObjectId
  content: string
  server: string
  role: string
  coin: number
  money: number
  commission: {
    game: number
    level: number
  }
}

export interface IDBCollabWithdraw {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  collab: Types.ObjectId
  user: Types.ObjectId
  code: string
  money: number
  status: number
  bank: {
    name: string
    number: string
    person: string
  }
  verify: {
    person: Types.ObjectId
    time: Date
    reason: string
  }
}