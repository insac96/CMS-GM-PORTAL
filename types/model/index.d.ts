import type { Model } from 'mongoose'

export { IDBConfig, IDBConfigStore } from './config'
export { IDBNews, IDBNewsCategory } from './news'

export { IDBAdsFrom } from './ads'

export { IDBUser, IDBUserLevel, IDBUserStore } from './user'
export { IDBRoleBody, IDBRolePet, IDBRoleWing } from './role'
export { IDBNotifyUser } from './notify'

export { IDBGate } from './gate'
export { IDBPayment } from './payment'
export { IDBSpend } from './spend'

export { IDBMission, IDBMissionHistory } from './mission'

export { IDBLogAdmin, IDBLogUser, IDBLogLogin } from './log'
export { IDBAdminIP, IDBBlockIP, IDBUserIP } from './ip'

export {
  IDBCollabLevel,
  IDBCollab, IDBCollabStore,
  IDBCollabNotify,
  IDBCollabIncome,
  IDBCollabWithdraw
} from './collab'

export {
  IDBEcoinSeason,
  IDBEcoinP2PBuy, IDBEcoinP2PBuyHistory,
  IDBEcoinP2PSell, IDBEcoinP2PSellHistory
} from './ecoin'

export { 
  IDBGamePlatform, 
  IDBGameCategory, 

  IDBGameTool, 
  IDBGameToolServerOpen,
  IDBGameToolUser, 
  IDBGameToolPayment,
  IDBGameToolRecharge, 
  IDBGameToolItem,
  IDBGameToolComment,
  IDBGameToolLogAdmin,

  IDBGameChina, 
  IDBGameChinaUser, 
  IDBGameChinaPayment,
  IDBGameChinaComment,
  IDBGameChinaLogAdmin,

  IDBGamePrivate,
  IDBGamePrivateServerOpen,
  IDBGamePrivateUser, IDBGamePrivateUserLogin,
  IDBGamePrivateRecharge, IDBGamePrivateRechargeHistory,
  IDBGamePrivateItem, IDBGamePrivateItemBox,
  IDBGamePrivateShopItem, IDBGamePrivateShopItemHistory,
  IDBGamePrivateShopPack, IDBGamePrivateShopPackHistory,
  IDBGamePrivateGiftcode, IDBGamePrivateGiftcodeHistory,
  IDBGamePrivateEvent, IDBGamePrivateEventHistory,
  IDBGamePrivateComment,
  IDBGamePrivateLogAdmin
} from './game'

export {
  IDBForumCategory, IDBForumCategorySub,
  IDBForumPost, IDBForumPostComment, IDBForumPostLike
} from './forum'

export { 
  IDBSocketChatGlobal, 
  IDBSocketOnline,
  IDBSocketChatSingle, IDBSocketChatSingleMessage
} from './socket'

export interface IGlobalDB {
  // Main DB
  Config: Model<IDBConfig>

  News: Model<IDBNews>
  NewsCategory: Model<IDBNewsCategory>

  AdsFrom: Model<IDBAdsFrom>

  User: Model<IDBUser>
  UserLevel: Model<IDBUserLevel>

  RoleBody: Model<IDBRoleBody>
  RoleWing: Model<IDBRoleWing>
  RolePet: Model<IDBRolePet>

  NotifyUser: Model<IDBNotifyUser>

  Gate: Model<IDBGate>
  Payment: Model<IDBPayment>
  Spend: Model<IDBSpend>

  Mission: Model<IDBMission>
  MissionHistory: Model<IDBMissionHistory>

  LogAdmin: Model<IDBLogAdmin>
  LogUser: Model<IDBLogUser>
  LogLogin: Model<IDBLogLogin>

  AdminIP: Model<IDBAdminIP>
  UserIP: Model<IDBUserIP>
  BlockIP: Model<IDBBlockIP>

  // Collab
  CollabLevel: Model<IDBCollabLevel>
  Collab: Model<IDBCollab>
  CollabNotify: Model<IDBCollabNotify>
  CollabIncome: Model<IDBCollabIncome>
  CollabWithdraw: Model<IDBCollabWithdraw>

  // Ecoin
  EcoinSeason: Model<IDBEcoinSeason>
  EcoinP2PBuy: Model<IDBEcoinP2PBuy>
  EcoinP2PBuyHistory: Model<IDBEcoinP2PBuyHistory>
  EcoinP2PSell: Model<IDBEcoinP2PSell>
  EcoinP2PSellHistory: Model<IDBEcoinP2PSellHistory>

  // Game DB
  GamePlatform: Model<IDBGamePlatform>
  GameCategory: Model<IDBGameCategory>

  GameTool: Model<IDBGameTool>
  GameToolServerOpen: Model<IDBGameToolServerOpen>
  GameToolUser: Model<IDBGameToolUser>
  GameToolPayment: Model<IDBGameToolPayment>
  GameToolRecharge: Model<IDBGameToolRecharge>
  GameToolItem: Model<IDBGameToolItem>
  GameToolComment: Model<IDBGameToolComment>
  GameToolLogAdmin: Model<IDBGameToolLogAdmin>

  GameChina: Model<IDBGameChina>
  GameChinaUser: Model<IDBGameChinaUser>
  GameChinaPayment: Model<IDBGameChinaPayment>
  GameChinaComment: Model<IDBGameChinaComment>
  GameChinaLogAdmin: Model<IDBGameChinaLogAdmin>

  GamePrivate: Model<IDBGamePrivate>
  GamePrivateServerOpen: Model<IDBGamePrivateServerOpen>
  GamePrivateUser: Model<IDBGamePrivateUser>
  GamePrivateUserLogin: Model<IDBGamePrivateUserLogin>
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
  GamePrivateLogAdmin: Model<IDBGamePrivateLogAdmin>

  // Forum DB
  ForumCategory: Model<IDBForumCategory>, 
  ForumCategorySub: Model<IDBForumCategorySub>, 
  ForumPost: Model<IDBForumPost>, 
  ForumPostComment: Model<IDBForumPostComment>, 
  ForumPostLike: Model<IDBForumPostLike>

  // Socket
  SocketChatGlobal: Model<IDBSocketChatGlobal>
  SocketOnline: Model<IDBSocketOnline>
  SocketChatSingle: Model<IDBSocketChatSingle>
  SocketChatSingleMessage: Model<IDBSocketChatSingleMessage>
}