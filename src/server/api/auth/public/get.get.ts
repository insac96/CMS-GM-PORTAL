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
    const nowLevel = await DB.UserLevel.findOne({ _id: user.level }).select('number') as IDBUserLevel
    const realLevel = await DB.UserLevel.findOne({ 'exp': { $lte: user.currency.exp }}).sort({ number: -1 }) as IDBUserLevel
    user.level = realLevel._id

    // User Role
    const listLevel = await DB.UserLevel.find({ 
      number: { $lte: realLevel.number },
      role: { $exists: true } 
    })
    .select('role')
    .sort({ number: 1 })

    const bodys : any = []
    const wings : any = []
    const pets : any = []
    listLevel.forEach(i => {
      !!i.role.body && bodys.push(i.role.body)
      !!i.role.wing && wings.push(i.role.wing)
      !!i.role.pet && pets.push(i.role.pet)
    })
    
    user.role.bag.body = mergeArray(user.role.bag.body, bodys)
    user.role.bag.wing = mergeArray(user.role.bag.wing, wings)
    user.role.bag.pet = mergeArray(user.role.bag.pet, pets)

    if(!user.role.use.body && bodys.length > 0) user.role.use.body = bodys[bodys.length - 1]
    if(!user.role.use.wing && wings.length > 0) user.role.use.wing = wings[wings.length - 1]
    if(!user.role.use.pet && pets.length > 0) user.role.use.pet = pets[pets.length - 1]

    if(!!nowLevel && nowLevel.number < realLevel.number){
      if(bodys.length > 0) user.role.use.body = bodys[bodys.length - 1]
      if(wings.length > 0) user.role.use.wing = wings[wings.length - 1]
      if(pets.length > 0) user.role.use.pet = pets[pets.length - 1]
    }

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