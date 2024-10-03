import type { Types } from 'mongoose'
export { IDBGameTool, IDBGameToolUser, IDBGameToolRecharge, IDBGameToolItem } from './tool'
export { IDBGameChina, IDBGameChinaUser, IDBGameChinaPayment } from './china'
export {
  IDBGamePrivate,
  IDBGamePrivateUser, IDBGamePrivateUserLogin,
  IDBGamePrivatePayment,
  IDBGamePrivateRecharge, IDBGamePrivateRechargeHistory,
  IDBGamePrivateItem, IDBGamePrivateItemBox,
  IDBGamePrivateShopItem, IDBGamePrivateShopItemHistory,
  IDBGamePrivateShopPack, IDBGamePrivateShopPackHistory,
  IDBGamePrivateGiftcode, IDBGamePrivateGiftcodeHistory
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