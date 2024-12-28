import type { IGlobalDB } from '~~/types'
import type { Mongoose } from 'mongoose'
import { DBConfig } from './config'
import { DBNews, DBNewsCategory } from './news'

import { DBAdsFrom } from './ads'

import { DBUser, DBUserLevel } from './user'
import { DBRoleBody, DBRolePet, DBRoleWing } from './role'

import { DBNotifyUser } from './notify'

import { DBGate } from './gate'
import { DBPayment } from './payment'
import { DBSpend } from './spend'

import { DBMission, DBMissionHistory } from './mission'

import { DBLogAdmin, DBLogLogin, DBLogUser } from './log'
import { DBAdminIP, DBBlockIP, DBUserIP } from './ip'

import { 
  DBCollabLevel,
  DBCollab,
  DBCollabNotify,
  DBCollabIncome,
  DBCollabWithdraw
} from './collab'

import { 
  DBGamePlatform, 
  DBGameCategory, 

  DBGameTool, 
  DBGameToolServerOpen,
  DBGameToolUser, 
  DBGameToolRecharge, 
  DBGameToolItem,
  DBGameToolComment,
  DBGameToolLogAdmin,

  DBGameChina, 
  DBGameChinaUser,
  DBGameToolPayment,
  DBGameChinaPayment,
  DBGameChinaComment,
  DBGameChinaLogAdmin,

  DBGamePrivate,
  DBGamePrivateServerOpen,
  DBGamePrivateUser, DBGamePrivateUserLogin,
  DBGamePrivateRecharge, DBGamePrivateRechargeHistory,
  DBGamePrivateItem, DBGamePrivateItemBox,
  DBGamePrivateShopItem, DBGamePrivateShopItemHistory,
  DBGamePrivateShopPack, DBGamePrivateShopPackHistory,
  DBGamePrivateGiftcode, DBGamePrivateGiftcodeHistory,
  DBGamePrivateEvent, DBGamePrivateEventHistory,
  DBGamePrivateComment,
  DBGamePrivateLogAdmin
} from './game'

import {
  DBForumCategory, DBForumCategorySub,
  DBForumPost, DBForumPostComment, DBForumPostLike
} from './forum'

import { 
  DBSocketChatGlobal, 
  DBSocketOnline,
  DBSocketChatSingle, DBSocketChatSingleMessage
} from './socket'

export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    // Main DB
    Config: DBConfig(mongoose),
    
    NewsCategory: DBNewsCategory(mongoose),
    News: DBNews(mongoose),

    AdsFrom: DBAdsFrom(mongoose),

    User: DBUser(mongoose),
    UserLevel: DBUserLevel(mongoose),

    RoleBody: DBRoleBody(mongoose),
    RoleWing: DBRoleWing(mongoose),
    RolePet: DBRolePet(mongoose),

    NotifyUser: DBNotifyUser(mongoose),

    Gate: DBGate(mongoose),
    Payment: DBPayment(mongoose),
    Spend: DBSpend(mongoose),

    Mission: DBMission(mongoose),
    MissionHistory: DBMissionHistory(mongoose),

    LogAdmin: DBLogAdmin(mongoose),
    LogUser: DBLogUser(mongoose),
    LogLogin: DBLogLogin(mongoose),

    AdminIP: DBAdminIP(mongoose),
    UserIP: DBUserIP(mongoose),
    BlockIP: DBBlockIP(mongoose),

    // Collab
    CollabLevel: DBCollabLevel(mongoose),
    Collab: DBCollab(mongoose),
    CollabNotify: DBCollabNotify(mongoose),
    CollabIncome: DBCollabIncome(mongoose),
    CollabWithdraw: DBCollabWithdraw(mongoose),

    // Game DB
    GamePlatform: DBGamePlatform(mongoose),
    GameCategory: DBGameCategory(mongoose),

    GameTool: DBGameTool(mongoose),
    GameToolServerOpen: DBGameToolServerOpen(mongoose),
    GameToolUser: DBGameToolUser(mongoose),
    GameToolPayment: DBGameToolPayment(mongoose),
    GameToolRecharge: DBGameToolRecharge(mongoose),
    GameToolItem: DBGameToolItem(mongoose),
    GameToolComment: DBGameToolComment(mongoose),
    GameToolLogAdmin: DBGameToolLogAdmin(mongoose),

    GameChina: DBGameChina(mongoose),
    GameChinaUser: DBGameChinaUser(mongoose),
    GameChinaPayment: DBGameChinaPayment(mongoose),
    GameChinaComment: DBGameChinaComment(mongoose),
    GameChinaLogAdmin: DBGameChinaLogAdmin(mongoose),

    GamePrivate: DBGamePrivate(mongoose),
    GamePrivateServerOpen: DBGamePrivateServerOpen(mongoose),
    GamePrivateUser: DBGamePrivateUser(mongoose),
    GamePrivateUserLogin: DBGamePrivateUserLogin(mongoose),
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
    GamePrivateLogAdmin: DBGamePrivateLogAdmin(mongoose),

    // Forum DB
    ForumCategory: DBForumCategory(mongoose),
    ForumCategorySub: DBForumCategorySub(mongoose),
    
    ForumPost: DBForumPost(mongoose),
    ForumPostComment: DBForumPostComment(mongoose),
    ForumPostLike: DBForumPostLike(mongoose),

    // Socket
    SocketChatGlobal: DBSocketChatGlobal(mongoose),
    SocketOnline: DBSocketOnline(mongoose),
    SocketChatSingle: DBSocketChatSingle(mongoose),
    SocketChatSingleMessage: DBSocketChatSingleMessage(mongoose)
  }
}