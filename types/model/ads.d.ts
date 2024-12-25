import type { Types } from 'mongoose'

export interface IDBAdsFrom {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  code: string
  note: string
  view: number
  sign: {
    in: number
    up: number
  }
}

export interface IDBAdsCollab {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  code: string
  user: Types.ObjectId
  note: string
  income: {
    discount: number
  }
  view: number
}