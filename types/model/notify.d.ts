import type { Types } from 'mongoose'

export interface IDBNotifyUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user?: Types.ObjectId
  watched: boolean
  color: string
  content: string
}