import type { Types } from 'mongoose'

export interface IDBSocketChatGlobal {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  content: string
  type: string
}