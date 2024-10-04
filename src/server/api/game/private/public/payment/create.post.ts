import type { IAuth, IDBGamePrivate, IDBGamePrivateUser, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    // Check Body
    const body = await readBody(event)
    const { game : key, coin } = body
    if(!key) throw 'Không tìm thấy mã trò chơi'
    if(!!isNaN(parseInt(coin)) || parseInt(coin) < 1) throw 'Số Xu không hợp lệ'

    // Check User
    const user = await DB.User.findOne({ _id: auth._id }).select('username currency') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(coin > user.currency.coin) throw 'Số dư xu không đủ để thực hiện'

    // Check Game
    const game = await DB.GamePrivate.findOne({ key: key, display: true }).select('name code rate.payment') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    // Check User Game
    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: auth._id }).select('_id') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi game trước khi nạp'

    // Make Code, Token
    const countPayment = await DB.GamePrivatePayment.count()
    const prefix = game.code.trim().toUpperCase()
    const code = prefix + (countPayment > 9 ? countPayment : `0${countPayment}`) + Math.floor(Math.random() * (99 - 10) + 10)
    
    // Make GCoin
    const bonus = formatRate(game.rate.payment)
    const gcoin = parseInt(coin) + Math.floor(parseInt(coin) * (bonus / 100))

    // Create
    await DB.GamePrivatePayment.create({
      user: userGame._id,
      game: game._id,
      coin: parseInt(coin),
      gcoin: gcoin,
      code: code,
    })

    await DB.User.updateOne({ _id: auth._id }, {
      $inc: { 'currency.coin': parseInt(coin) * -1 }
    })

    await DB.GamePrivateUser.updateOne({ _id: userGame._id }, {
      $inc: { 'currency.gcoin': gcoin }
    })

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
