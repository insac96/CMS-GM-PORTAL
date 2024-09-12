import type { Types } from 'mongoose'
export { IDBGameTool, IDBGameToolUser } from './tool'
export { IDBGameChina, IDBGameChinaPayment } from './china'

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