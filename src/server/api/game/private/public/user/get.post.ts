import type { IAuth, IDBGamePrivateUser, IDBGamePrivate, IDBGamePrivateUserLogin } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { game : code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'

    // Check Game
    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    // Check Auth
    const auth = await getAuth(event, false)
    if(!auth) return resp(event, { result: null }) 
    
    // Check User Game
    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: (auth as IAuth)._id }) as IDBGamePrivateUser
    if(!userGame) return resp(event, { result: null }) 

    // Check Block
    if(!!userGame.block) throw 'Bạn bị chặn khỏi trò chơi này'

    // Get Date
    const now  = new Date()
    const nowDate = formatDate(event, now)
    const lastDate = formatDate(event, userGame.login.update)
    userGame.login.update = now

    // User Login
    let createNewLogin = false
    const lastLogin = await DB.GamePrivateUserLogin
    .findOne({ user: userGame._id, game: game._id })
    .sort({ createdAt: -1 })
    .limit(1) as IDBGamePrivateUserLogin
    if(!lastLogin) {
      createNewLogin = true
    }
    else {
      const lastLoginDate = formatDate(event, lastLogin.createdAt)
      if(lastLoginDate.day != nowDate.day) createNewLogin = true
    }
    if(!!createNewLogin) await DB.GamePrivateUserLogin.create({ user: userGame._id, game: game._id })

    // Update If Is Next Day
    if(lastDate.day != nowDate.day || lastDate.month != nowDate.month || lastDate.year != nowDate.year){
      userGame.login.week = userGame.login.week + 1
      userGame.login.month = userGame.login.month + 1
      userGame.login.total = userGame.login.total + 1
      userGame.spend.day.coin = 0
      userGame.spend.day.count = 0
    }

    // Update If Is Next Week
    if(lastDate.week != nowDate.week || lastDate.month != nowDate.month || lastDate.year != nowDate.year){
      userGame.login.week = 1
      userGame.spend.week.coin = 0
      userGame.spend.week.count = 0
    }

    // Update If Is Next Month
    if(lastDate.month != nowDate.month || lastDate.year != nowDate.year){
      userGame.login.month = 1
      userGame.spend.month.coin = 0
      userGame.spend.month.count = 0
    }

    // Save
    await userGame.save()
    return resp(event, { result: userGame })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})