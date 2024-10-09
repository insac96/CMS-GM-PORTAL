import type { Model } from 'mongoose'
export { IDBConfig, IDBConfigStore } from './config'
export { IDBNews, IDBNewsCategory } from './news'
export { IDBUser, IDBUserStore } from './user'
export { IDBGate } from './gate'
export { IDBPayment } from './payment'
export { IDBSpend } from './spend'
export { IDBNotifyUser } from './notify'
export { 
  IDBGamePlatform, 
  IDBGameCategory, 

  IDBGameTool, 
  IDBGameToolUser, 
  IDBGameToolPayment,
  IDBGameToolRecharge, 
  IDBGameToolItem,
  IDBGameToolComment,

  IDBGameChina, 
  IDBGameChinaUser, 
  IDBGameChinaPayment,
  IDBGameChinaComment,

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
} from './game'
export { IDBLogAdmin, IDBLogUser, IDBLogLogin } from './log'
export { IDBAdminIP, IDBBlockIP, IDBUserIP } from './ip'

export interface IGlobalDB {
  Config: Model<IDBConfig>

  News: Model<IDBNews>
  NewsCategory: Model<IDBNewsCategory>

  User: Model<IDBUser>

  Gate: Model<IDBGate>

  Payment: Model<IDBPayment>

  Spend: Model<IDBSpend>

  NotifyUser: Model<IDBNotifyUser>

  GamePlatform: Model<IDBGamePlatform>
  GameCategory: Model<IDBGameCategory>

  GameTool: Model<IDBGameTool>
  GameToolUser: Model<IDBGameToolUser>
  GameToolPayment: Model<IDBGameToolPayment>
  GameToolRecharge: Model<IDBGameToolRecharge>
  GameToolItem: Model<IDBGameToolItem>
  GameToolComment: Model<IDBGameToolComment>

  GameChina: Model<IDBGameChina>
  GameChinaUser: Model<IDBGameChinaUser>
  GameChinaPayment: Model<IDBGameChinaPayment>
  GameChinaComment: Model<IDBGameChinaComment>

  GamePrivate: Model<IDBGamePrivate>
  GamePrivateUser: Model<IDBGamePrivateUser>
  GamePrivateUserLogin: Model<IDBGamePrivateUserLogin>
  GamePrivatePayment: Model<IDBGamePrivatePayment>
  GamePrivateRecharge: Model<IDBGamePrivateRecharge>
  GamePrivateRechargeHistory: Model<IDBGamePrivateRechargeHistory>
  GamePrivateItem: Model<IDBGamePrivateItem>
  GamePrivateItemBox: Model<IDBGamePrivateItemBox>
  GamePrivateShopItem: Model<IDBGamePrivateShopItem>
  GamePrivateShopItemHistory: Model<IDBGamePrivateShopItemHistory>
  GamePrivateShopPack: Model<IDBGamePrivateShopPack>
  GamePrivateShopPackHistory: Model<IDBGamePrivateShopPackHistory>
  GamePrivateGiftcode: Model<IDBGamePrivateGiftcode>
  GamePrivateGiftcodeHistory: Model<IDBGamePrivateGiftcodeHistory>
  GamePrivateEvent: Model<IDBGamePrivateEvent>
  GamePrivateEventHistory: Model<IDBGamePrivateEventHistory>
  GamePrivateComment: Model<IDBGamePrivateComment>

  LogAdmin: Model<IDBLogAdmin>
  LogUser: Model<IDBLogUser>
  LogLogin: Model<IDBLogLogin>

  AdminIP: Model<IDBAdminIP>
  UserIP: Model<IDBUserIP>
  BlockIP: Model<IDBBlockIP>
}