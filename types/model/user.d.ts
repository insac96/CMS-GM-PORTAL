import type { Types } from 'mongoose'
import type { IDBLevel } from './level'

export interface IDBUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  username: string
  password: string
  email: string
  phone: string
  avatar: string
  level: Types.ObjectId | IDBUserLevel
  role: {
    use: {
      body: Types.ObjectId
      wing: Types.ObjectId
      pet: Types.ObjectId
    }
    custom: {
      body: boolean
      wing: boolean
      pet: boolean
    }
    bag: {
      body: Array<Types.ObjectId>
      wing: Array<Types.ObjectId>
      pet: Array<Types.ObjectId>
    }
  }
  vip: {
    month: {
      enable: boolean
      end: date
    },
    forever: {
      enable: boolean
      end: date
    }
  }
  reg: {
    from: Types.ObjectId
    collab: Types.ObjectId
    platform: string
  }
  social: {
    facebook: string
    messenger: string
    zalo: string
    telegram: string
    tiktok: string
  }
  currency: {
    exp: number
    coin: number
    ecoin: number
    vnd: number
  }
  china: {
    youxi: boolean
  }
  type: number
  online: boolean
  block: boolean
  token: string
  
  // Function
  save: {
    () : void
  }
}

export interface IDBUserLevel {
  _id: Types.ObjectId
  title: string
  number: number
  exp: number
  role: {
    body: Types.ObjectId,
    wing: Types.ObjectId,
    pet: Types.ObjectId
  }
  bonus: {
    payment: number
  }
  limit: {
    chat: number
  }
  discount: {
    shop: number
  }
}

export interface IDBUserStore {
  _id? : Types.ObjectId
  username? : string
  type?: number
  currency?: IDBUser['currency']
  level?: IDBUserLevel
  vip?: IDBUser['vip']
  notify?: number
}