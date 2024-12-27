import type { Types } from 'mongoose'

export interface IDBCollab {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  code: string
  user: Types.ObjectId
  note: string
  view: number
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