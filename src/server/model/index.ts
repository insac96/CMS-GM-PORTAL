import type { IGlobalDB } from '~~/types'
import type { Mongoose } from 'mongoose'
import { DBConfig } from './config'
import { DBNews, DBNewsCategory } from './news'
import { DBUser, DBUserLevel } from './user'
import { DBGate } from './gate'
import { DBPayment } from './payment'
import { DBSpend } from './spend'
import { DBNotifyUser } from './notify'
import { DBLogAdmin, DBLogLogin, DBLogUser } from './log'
import { DBAdminIP, DBBlockIP, DBUserIP } from './ip'
import { 
  DBGamePlatform, 
  DBGameCategory, 

  DBGameTool, 
  DBGameToolUser, 
  DBGameToolRecharge, 
  DBGameToolItem,
  DBGameToolComment,

  DBGameChina, 
  DBGameChinaUser,
  DBGameToolPayment,
  DBGameChinaPayment,
  DBGameChinaComment,

  DBGamePrivate,
  DBGamePrivateUser, DBGamePrivateUserLogin,
  DBGamePrivatePayment,
  DBGamePrivateRecharge, DBGamePrivateRechargeHistory,
  DBGamePrivateItem, DBGamePrivateItemBox,
  DBGamePrivateShopItem, DBGamePrivateShopItemHistory,
  DBGamePrivateShopPack, DBGamePrivateShopPackHistory,
  DBGamePrivateGiftcode, DBGamePrivateGiftcodeHistory,
  DBGamePrivateEvent, DBGamePrivateEventHistory,
  DBGamePrivateComment
} from './game'
import {
  DBForumCategory, DBForumCategorySub,
  DBForumPost, DBForumPostComment, DBForumPostLike
} from './forum'

export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    // Main DB
    Config: DBConfig(mongoose),
    
    NewsCategory: DBNewsCategory(mongoose),
    News: DBNews(mongoose),

    User: DBUser(mongoose),
    UserLevel: DBUserLevel(mongoose),
    NotifyUser: DBNotifyUser(mongoose),

    Gate: DBGate(mongoose),
    Payment: DBPayment(mongoose),
    Spend: DBSpend(mongoose),

    LogAdmin: DBLogAdmin(mongoose),
    LogUser: DBLogUser(mongoose),
    LogLogin: DBLogLogin(mongoose),

    AdminIP: DBAdminIP(mongoose),
    UserIP: DBUserIP(mongoose),
    BlockIP: DBBlockIP(mongoose),

    // Game DB
    GamePlatform: DBGamePlatform(mongoose),
    GameCategory: DBGameCategory(mongoose),

    GameTool: DBGameTool(mongoose),
    GameToolUser: DBGameToolUser(mongoose),
    GameToolPayment: DBGameToolPayment(mongoose),
    GameToolRecharge: DBGameToolRecharge(mongoose),
    GameToolItem: DBGameToolItem(mongoose),
    GameToolComment: DBGameToolComment(mongoose),

    GameChina: DBGameChina(mongoose),
    GameChinaUser: DBGameChinaUser(mongoose),
    GameChinaPayment: DBGameChinaPayment(mongoose),
    GameChinaComment: DBGameChinaComment(mongoose),

    GamePrivate: DBGamePrivate(mongoose),
    GamePrivateUser: DBGamePrivateUser(mongoose),
    GamePrivateUserLogin: DBGamePrivateUserLogin(mongoose),
    GamePrivatePayment: DBGamePrivatePayment(mongoose),
    GamePrivateRecharge: DBGamePrivateRecharge(mongoose),
    GamePrivateRechargeHistory: DBGamePrivateRechargeHistory(mongoose),
    GamePrivateItem: DBGamePrivateItem(mongoose),
    GamePrivateItemBox: DBGamePrivateItemBox(mongoose),
    GamePrivateShopItem: DBGamePrivateShopItem(mongoose),
    GamePrivateShopItemHistory: DBGamePrivateShopItemHistory(mongoose),
    GamePrivateShopPack: DBGamePrivateShopPack(mongoose),
    GamePrivateShopPackHistory: DBGamePrivateShopPackHistory(mongoose),
    GamePrivateGiftcode: DBGamePrivateGiftcode(mongoose),
    GamePrivateGiftcodeHistory: DBGamePrivateGiftcodeHistory(mongoose),
    GamePrivateEvent: DBGamePrivateEvent(mongoose),
    GamePrivateEventHistory: DBGamePrivateEventHistory(mongoose),
    GamePrivateComment: DBGamePrivateComment(mongoose),

    // Forum DB
    ForumCategory: DBForumCategory(mongoose),
    ForumCategorySub: DBForumCategorySub(mongoose),
    
    ForumPost: DBForumPost(mongoose),
    ForumPostComment: DBForumPostComment(mongoose),
    ForumPostLike: DBForumPostLike(mongoose)
  }
}