import type { Types } from 'mongoose'
export { 
  IDBGameTool, 
  IDBGameToolUser, 
  IDBGameToolPayment, 
  IDBGameToolRecharge, 
  IDBGameToolItem ,
  IDBGameToolComment
} from './tool'
export { 
  IDBGameChina, 
  IDBGameChinaUser, 
  IDBGameChinaPayment, 
  IDBGameChinaComment 
} from './china'
export {
  IDBGamePrivate,
  IDBGamePrivateUser, IDBGamePrivateUserLogin,
  IDBGamePrivatePayment,
  IDBGamePrivateRecharge, IDBGamePrivateRechargeHistory,
  IDBGamePrivateItem, IDBGamePrivateItemBox,
  IDBGamePrivateShopItem, IDBGamePrivateShopItemHistory,
  IDBGamePrivateShopPack, IDBGamePrivateShopPackHistory,
  IDBGamePrivateGiftcode, IDBGamePrivateGiftcodeHistory,
  IDBGamePrivateEvent, IDBGamePrivateEventHistory,
  IDBGamePrivateComment
} from './private'

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