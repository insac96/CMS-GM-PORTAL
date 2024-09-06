import type { Model } from 'mongoose'
export { IDBConfig, IDBConfigStore } from './config'
export { IDBNews, IDBNewsCategory } from './news'
export { IDBUser, IDBUserStore } from './user'
export { IDBGate } from './gate'
export { IDBPayment } from './payment'
export { IDBSpend } from './spend'
export { IDBOrder } from './order'
export { IDBNotifyUser } from './notify'
export { IDBGamePlatform, IDBGameCategory, IDBGame } from './game'
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

  Order: Model<IDBOrder>

  NotifyUser: Model<IDBNotifyUser>

  GamePlatform: Model<IDBGamePlatform>
  GameCategory: Model<IDBGameCategory>
  Game: Model<IDBGame>

  LogAdmin: Model<IDBLogAdmin>
  LogUser: Model<IDBLogUser>
  LogLogin: Model<IDBLogLogin>

  AdminIP: Model<IDBAdminIP>
  UserIP: Model<IDBUserIP>
  BlockIP: Model<IDBBlockIP>
}