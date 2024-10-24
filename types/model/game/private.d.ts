import type { Types } from 'mongoose'
import type { IDBGamePrivateUser } from '../user'
import type { IDBGamePlatform, IDBGameCategory } from '../game'

export interface IDBGamePrivate {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  platform: Types.ObjectId | IDBGamePlatform
  category: Types.ObjectId | IDBGameCategory

  name: string
  code: string
  key: string
  description: string
  image: {
    banner: string
    logo: string
    icon: string
    review: Array<string>
  }

  content: string

  ip: string
  port: number
  mobile: boolean
  paygame: boolean
  secret: string

  api: {
    start: string
    server: string
    role: string
    roles: string
    mail: string
    recharge: string
    level: string
    power: string
    os: string
  }

  play: {
    web: string
    windows: string
    android: string
    ios: string
  }

  rate: {
    shop: {
      default: number
      limit: {
        number: number
        expired: Date
      }
    }
  }

  statistic: {
    play: number
    view: number
    user: number
    revenue: number
  }

  manager: Array<Types.ObjectId>

  pin: boolean
  display: boolean
}

// User
export interface IDBGamePrivateUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId | IDBUser
  game: Types.ObjectId | IDBGamePrivate

  block: boolean

  spend: {
    day: {
      coin: number
      count: number
    }
    week: {
      coin: number
      count: number
    }
    month: {
      coin: number
      count: number
    }
    total: {
      coin: number
      count: number
    }
  }

  login: {
    week: number
    month: number
    total: number
    update: Date
  }

  // Function
  save: {
    () : void
  }
}

export interface IDBGamePrivateUserLogin {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId | IDBGamePrivateUser
  game: Types.ObjectId | IDBGamePrivate
}

// Recharge
export interface IDBGamePrivateRecharge {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  game: Types.ObjectId | IDBGamePrivate

  recharge_id: string
  recharge_name: string
  save_pay: number
  price: number
  pin: boolean
  display: boolean
}

export interface IDBGamePrivateRechargeHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId | IDBGamePrivateUser
  game: Types.ObjectId | IDBGamePrivate
  recharge: Types.ObjectId | IDBGamePrivateRecharge

  price: number
  server: string
  role: string
}

// Item
export interface IDBGamePrivateItem {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  game: Types.ObjectId | IDBGamePrivate

  item_id: string
  item_name: string
  item_image: string
}

export interface IDBGamePrivateItemBox {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  game: Types.ObjectId | IDBGamePrivate

  name: string
  gift: Array<{
    item: Types.ObjectId | IDBGamePrivateItem,
    amount: number
  }>
}

// Shop Item
export interface IDBGamePrivateShopItem {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  game: Types.ObjectId | IDBGamePrivate
  item: Types.ObjectId | IDBGamePrivateItem

  amount: number
  price: number
  limit: number
  pin: boolean
  display: boolean
}

export interface IDBGamePrivateShopItemHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId | IDBGamePrivateUser
  game: Types.ObjectId | IDBGamePrivate
  item: Types.ObjectId | IDBGamePrivateItem

  price: number
  amount: number
  server: string
  role: string
}

// Shop Pack
export interface IDBGamePrivateShopPack {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  game: Types.ObjectId | IDBGamePrivate

  name: string
  gift: Array<{
    item: Types.ObjectId | IDBGamePrivateItem,
    amount: number
  }>
  price: number
  limit: number
  pin: boolean
  display: boolean
}

export interface IDBGamePrivateShopPackHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId | IDBGamePrivateUser
  game: Types.ObjectId | IDBGamePrivate
  pack: Types.ObjectId | IDBGamePrivateShopPack

  price: number
  amount: number
  server: string
  role: string
}

// Giftcode
export interface IDBGamePrivateGiftcode {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  game: Types.ObjectId | IDBGamePrivate

  code: string
  servers: Array<Types.ObjectId>
  users: Array<Types.ObjectId>
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
  limit: number
  expired: Date
  public: boolean
  justone: boolean
  display: boolean
}

export interface IDBGamePrivateGiftcodeHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId | IDBGamePrivateUser
  game: Types.ObjectId | IDBGamePrivate
  giftcode: Types.ObjectId | IDBGamePrivateGiftcode

  server: string
  role: string
}

// Event
export interface IDBGamePrivateEvent {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  game: Types.ObjectId | IDBGamePrivate

  type: string
  need: number
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
  display: boolean
}

export interface IDBGamePrivateEventHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId | IDBGamePrivateUser
  game: Types.ObjectId | IDBGamePrivate
  event: Types.ObjectId | IDBGamePrivateEvent

  server: string
  role: string
}

// Comment
export interface IDBGamePrivateComment {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId | IDBGamePrivateUser
  game: Types.ObjectId | IDBGamePrivate
  content: string
}