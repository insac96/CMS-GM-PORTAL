import type { Types } from 'mongoose'
export { IDBGameTool, IDBGameToolUser, IDBGameToolRecharge } from './tool'
export { IDBGameChina, IDBGameChinaUser, IDBGameChinaPayment } from './china'

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