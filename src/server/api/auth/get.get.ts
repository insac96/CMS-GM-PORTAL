import type { IAuth, IDBLogLogin, IDBUser, IDBUserStore } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    // Get User
    const auth = await getAuth(event) as IAuth
    const user = await DB.User.findOne({ _id: auth._id }) as IDBUser

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

    // Result
    const userStore : IDBUserStore = {
      _id: user._id,
      username: user.username,
      type: user.type,
      currency: user.currency
    }

    userStore.notify = await DB.NotifyUser.count({ user: user._id, watched: false })

    return resp(event, { result: userStore })
  } 
  catch (e:any) {
    return resp(event, { code: 401, message: e.toString() })
  }
})