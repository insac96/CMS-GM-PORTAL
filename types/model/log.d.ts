import type { Types } from 'mongoose'

export interface IDBLogAdmin {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId
  action: string
}

export interface IDBLogUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  type: string
  user: Types.ObjectId
  action: string
  target: string
}

export interface IDBLogLogin {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId
}