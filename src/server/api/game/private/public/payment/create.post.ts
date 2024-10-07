import type { IAuth, IDBGamePrivate, IDBGamePrivatePayment, IDBGamePrivateUser, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    // Check Body
    const body = await readBody(event)
    const { game : gameCode, coin } = body
    if(!gameCode) throw 'Không tìm thấy mã trò chơi'
    if(!!isNaN(parseInt(coin)) || parseInt(coin) < 1) throw 'Số Xu không hợp lệ'

    // Check User
    const user = await DB.User.findOne({ _id: auth._id }).select('username currency') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(coin > user.currency.coin) throw 'Số dư xu không đủ để thực hiện'

    // Check Game
    const game = await DB.GamePrivate.findOne({ code: gameCode, display: true }).select('name code rate.payment') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    // Check User Game
    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: auth._id }).select('pay') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi game trước khi nạp'

    // Make Code, Token
    const lastPayment = await DB.GamePrivatePayment.findOne({ user: userGame._id, game: game._id }).select('createdAt').limit(1) as IDBGamePrivatePayment
    const countPayment = await DB.GamePrivatePayment.count()
    const prefix = game.code.trim().toUpperCase()
    const code = prefix + (countPayment > 9 ? countPayment : `0${countPayment}`) + Math.floor(Math.random() * (99 - 10) + 10)
    
    // Make GCoin
    const bonus = formatRate(game.rate.payment)
    const gcoin = parseInt(coin) + Math.floor(parseInt(coin) * (bonus / 100))

    // Create
    const time = new Date()
    await DB.GamePrivatePayment.create({
      user: userGame._id,
      game: game._id,
      coin: parseInt(coin),
      gcoin: gcoin,
      code: code,
    })

    // Update Pay Running
    if(userGame.pay.running.day == 0 || !lastPayment) userGame.pay.running.day = 1
    else {
      const payNowTime = formatDate(event, time)
      const payLastTime = formatDate(event, lastPayment.createdAt)
      if(payNowTime.day != payLastTime.day || payNowTime.month != payLastTime.month || payNowTime.year !=  payLastTime.year){
        const nowStart = payNowTime.dayjs.startOf('day').unix()
        const lastStart = payLastTime.dayjs.startOf('day').unix()
        if((nowStart - lastStart) > (24 * 60 * 60)){
          userGame.pay.running.day = 1
          userGame.pay.running.receive = 0
        }
        else {
          userGame.pay.running.day = userGame.pay.running.day + 1
        }
      }
    }

    // Update Pay Musty
    const hasMoneyMusty = userGame.pay.musty.find(i => i == parseInt(coin))
    if(!hasMoneyMusty) userGame.pay.musty.push(parseInt(coin))
    
    // Update Coin
    await DB.User.updateOne({ _id: auth._id }, { $inc: { 'currency.coin': parseInt(coin) * -1 }})

    // Update Gcoin And Pay
    await userGame.save()
    await DB.GamePrivateUser.updateOne({ _id: userGame._id }, {
      $inc: { 
        'currency.gcoin': gcoin ,
        'pay.day.coin': coin,
        'pay.week.coin': coin,
        'pay.month.coin': coin,
        'pay.total.coin': coin,
        'pay.day.count': 1,
        'pay.week.count': 1,
        'pay.month.count': 1,
        'pay.total.count': 1,
      }
    })

    // Update revenue game
    await DB.GamePrivate.updateOne({ _id: game._id }, { $inc: { 'statistic.revenue': coin }})

    // Notify and Log
    const notify = `
      Trừ <b>${coin.toLocaleString('vi-VN')}</b> Xu 
      từ giao dịch nạp GCoin
      <b>[Game Private] ${game.name}</b>
      với mã giao dịch <b>${code}</b>
    `
    await sendNotifyUser({ user: user._id, color: 'red', content: notify })
    logUser(event, user._id, notify)

    return resp(event, { message: 'Giao dịch thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
