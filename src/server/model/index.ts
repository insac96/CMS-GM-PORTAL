import type { IGlobalDB } from '~~/types'
import type { Mongoose } from 'mongoose'
import { DBConfig } from './config'
import { DBNews, DBNewsCategory } from './news'
import { DBUser } from './user'
import { DBGate } from './gate'
import { DBPayment } from './payment'
import { DBSpend } from './spend'
import { DBNotifyUser } from './notify'
import { 
  DBGamePlatform, DBGameCategory, 
  DBGameTool, DBGameToolUser, DBGameToolRecharge, DBGameToolItem,
  DBGameChina, DBGameChinaUser, DBGameChinaPayment 
} from './game'
import { DBLogAdmin, DBLogLogin, DBLogUser } from './log'
import { DBAdminIP, DBBlockIP, DBUserIP } from './ip'

export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    Config: DBConfig(mongoose),
    
    NewsCategory: DBNewsCategory(mongoose),
    News: DBNews(mongoose),

    User: DBUser(mongoose),

    Gate: DBGate(mongoose),

    Payment: DBPayment(mongoose),

    Spend: DBSpend(mongoose),

    NotifyUser: DBNotifyUser(mongoose),

    GamePlatform: DBGamePlatform(mongoose),
    GameCategory: DBGameCategory(mongoose),

    GameTool: DBGameTool(mongoose),
    GameToolUser: DBGameToolUser(mongoose),
    GameToolRecharge: DBGameToolRecharge(mongoose),
    GameToolItem: DBGameToolItem(mongoose),

    GameChina: DBGameChina(mongoose),
    GameChinaUser: DBGameChinaUser(mongoose),
    GameChinaPayment: DBGameChinaPayment(mongoose),

    LogAdmin: DBLogAdmin(mongoose),
    LogUser: DBLogUser(mongoose),
    LogLogin: DBLogLogin(mongoose),

    AdminIP: DBAdminIP(mongoose),
    UserIP: DBUserIP(mongoose),
    BlockIP: DBBlockIP(mongoose)
  }
}