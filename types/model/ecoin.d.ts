import type { Types } from 'mongoose'

export interface IDBEcoinSeason {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  title: string

  time: {
    start: Date
    end: Date
  }

  ecoin: number
  vnd: number

  farming?: number
  price?: number
  
  active: boolean
}

export interface IDBEcoinP2PBuy {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId

  ecoin: number
  vnd: number

  limit: {
    start: number
    end: number
  }
  
  status: number
}

export interface IDBEcoinP2PBuyHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  buyer: Types.ObjectId
  seller: Types.ObjectId
  booth: Types.ObjectId

  ecoin: number
  vnd: number
}

export interface IDBEcoinP2PSell {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId

  ecoin: number
  vnd: number

  limit: {
    start: number
    end: number
  }
  
  status: number
}

export interface IDBEcoinP2PSellHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  buyer: Types.ObjectId
  seller: Types.ObjectId
  booth: Types.ObjectId

  ecoin: number
  vnd: number
}