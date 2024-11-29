import { Types } from "mongoose"
import type { IAuth, IDBLogLogin, IDBUser, IDBUserLevel, IDBUserStore } from "~~/types"

const mergeArray = (input : Array<Types.ObjectId>, list : Array<Types.ObjectId>) => {
  const arr = input.concat(list)

  const merge = arr.reduce((a : Array<Types.ObjectId>, c : Types.ObjectId) => {
    const obj = a.find((obj : Types.ObjectId) => obj.toString() === c.toString())
    if(!obj) a.push(c)
    return a
  }, [])

  return merge
}

export default defineEventHandler(async (event) => {
  try {
    // Get User
    const auth = await getAuth(event) as IAuth
    const user = await DB.User.findOne({ _id: auth._id }).select('username level vip currency type role') as IDBUser

    // Get Date
    const now  = new Date()
    const nowDate = formatDate(event, now)

    // User Login
    let createNewLogin = false
    const lastLogin = await DB.LogLogin.findOne({ user: user._id }).sort({ createdAt: -1 }).limit(1) as IDBLogLogin
    if(!lastLogin) createNewLogin = true
    else {
      const lastLoginDate = formatDate(event, lastLogin.createdAt)
      if(lastLoginDate.day != nowDate.day) createNewLogin = true
    }
    if(!!createNewLogin) await DB.LogLogin.create({ user: user._id })

    // User Level
    // const nowLevel = await DB.UserLevel.findOne({ _id: user.level }).select('number') as IDBUserLevel
    const realLevel = await DB.UserLevel.findOne({ 'exp': { $lte: user.currency.exp }}).sort({ number: -1 }) as IDBUserLevel
    user.level = realLevel._id

    // User Role
    if(!!realLevel.role.body) user.role.use.body = realLevel.role.body
    if(!!realLevel.role.wing) user.role.use.wing = realLevel.role.wing
    if(!!realLevel.role.pet) user.role.use.pet = realLevel.role.pet

    // User VIP
    if(!!user.vip.month.enable && !user.vip.forever.enable){
      const end = DayJS(user.vip.month.end).unix()
      const now = DayJS(Date.now()).unix()
      if(end < now){
        user.vip.month.enable = false
        user.vip.month.end = null
      }
    }

    // Result
    await user.save()
    const userStore : IDBUserStore = {
      _id: user._id,
      username: user.username,
      type: user.type,
      currency: user.currency,
      level: realLevel,
      vip: user.vip
    }

    userStore.notify = await DB.NotifyUser.count({ user: user._id, watched: false })

    return resp(event, { result: userStore })
  } 
  catch (e:any) {
    return resp(event, { code: 401, message: e.toString() })
  }
})