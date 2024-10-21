import type { Model } from 'mongoose'
export { IDBConfig, IDBConfigStore } from './config'
export { IDBNews, IDBNewsCategory } from './news'
export { IDBUser, IDBUserLevel, IDBUserStore } from './user'
export { IDBGate } from './gate'
export { IDBPayment } from './payment'
export { IDBSpend } from './spend'
export { IDBMission } from './mission'
export { IDBNotifyUser } from './notify'
export { IDBLogAdmin, IDBLogUser, IDBLogLogin } from './log'
export { IDBAdminIP, IDBBlockIP, IDBUserIP } from './ip'

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

export {
  IDBForumCategory, IDBForumCategorySub,
  IDBForumPost, IDBForumPostComment, IDBForumPostLike
} from './forum'

export interface IGlobalDB {
  // Main DB
  Config: Model<IDBConfig>

  News: Model<IDBNews>
  NewsCategory: Model<IDBNewsCategory>

  User: Model<IDBUser>
  UserLevel: Model<IDBUserLevel>
  NotifyUser: Model<IDBNotifyUser>

  Gate: Model<IDBGate>
  Payment: Model<IDBPayment>
  Spend: Model<IDBSpend>

  LogAdmin: Model<IDBLogAdmin>
  LogUser: Model<IDBLogUser>
  LogLogin: Model<IDBLogLogin>

  AdminIP: Model<IDBAdminIP>
  UserIP: Model<IDBUserIP>
  BlockIP: Model<IDBBlockIP>

  // Game DB
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

  // Forum DB
  ForumCategory: Model<IDBForumCategory>, 
  ForumCategorySub: Model<IDBForumCategorySub>, 
  ForumPost: Model<IDBForumPost>, 
  ForumPostComment: Model<IDBForumPostComment>, 
  ForumPostLike: Model<IDBForumPostLike>
}