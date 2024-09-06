import type { Types } from 'mongoose'

export interface IDBOrder {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  game: Types.ObjectId

  recharge: boolean
  mail: boolean

  coin: number
}