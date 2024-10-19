import type { Types } from 'mongoose'
import type { IDBUser } from './user'

export interface IDBForumCategory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  name: string
  key: string
  description: string
  icon: string
  color: string
  display: boolean
}

export interface IDBForumCategorySub {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  category: Types.ObjectId | IDBForumCategory
  name: string
  key: string
  description: string
  display: boolean
}

export interface IDBForumPost {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  category: Types.ObjectId | IDBForumCategory
  sub: Types.ObjectId | IDBForumCategorySub
  creater: Types.ObjectId | IDBUser
  
  title: string
  content: string
  key: string

  statistic: {
    view: number
    like: number
    comment: number
  }

  update: {
    comment: Date
    like: Date
    last: Date
  }

  enable: {
    comment: boolean
  }

  close: boolean
  block: boolean
  pin: boolean
}

export interface IDBForumPostLike {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  post: Types.ObjectId | IDBForumPost
  user: Types.ObjectId | IDBUser
}

export interface IDBForumPostComment {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  post: Types.ObjectId | IDBForumPost
  user: Types.ObjectId | IDBUser
  content: string
}
