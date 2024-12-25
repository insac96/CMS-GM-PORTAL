import type { Types } from 'mongoose'

export interface IDBNewsCategory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  name: string
  key: string
  color: string
}

export interface IDBNews {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  category: Types.ObjectId
  collab: Types.ObjectId
  
  title: string
  description: string 
  key: string
  og_image: string

  content: string

  view: number
  
  creator: Types.ObjectId
  updater: Types.ObjectId

  pin: boolean
  display: boolean
}
