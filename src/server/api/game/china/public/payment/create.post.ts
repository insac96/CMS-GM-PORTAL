import type { IAuth, IDBConfig, IDBGameChina, IDBGameChinaUser, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    // Check Body
    const body = await readBody(event)
    const { game : key, coin } = body
    if(!key) throw 'Không tìm thấy mã trò chơi'
    if(!!isNaN(parseInt(coin)) || parseInt(coin) < 1) throw 'Số tiền không hợp lệ'
    if(parseInt(coin) < 20000) throw 'Số tiền phải lớn hơn hoặc bằng 20.000đ'

    // Check User
    const user = await DB.User.findOne({ _id: auth._id }).select('username currency') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(coin > user.currency.coin) throw 'Số dư xu không đủ để thực hiện'

    // Check Game
    const game = await DB.GameChina.findOne({ key: key, display: true }).select('name code') as IDBGameChina
    if(!game) throw 'Trò chơi không tồn tại'

    // Check User
    const userGameChina = await DB.GameChinaUser.findOne({ game: game._id, user: auth._id }).select('_id') as IDBGameChinaUser
    if(!userGameChina) throw 'Vui lòng chơi game trước khi nạp'

    // Make Code, Token
    const countPayment = await DB.GameChinaPayment.count()
    const prefix = game.code.trim().toUpperCase()
    const code = prefix + (countPayment > 9 ? countPayment : `0${countPayment}`) + Math.floor(Math.random() * (99 - 10) + 10)
    
    // Create
    await DB.GameChinaPayment.create({
      user: auth._id,
      game: game._id,
      coin: parseInt(coin),
      code: code,
    })

    await DB.User.updateOne({ _id: auth._id }, {
      $inc: { 'currency.coin': parseInt(coin) * -1 }
    })

    // Notify and Log
    const notify = `
      Trừ <b>${coin.toLocaleString('vi-VN')}</b> Xu 
      từ lệnh nạp 
      <b>[Game China] ${game.name}</b> 
      với mã giao dịch <b>${code}</b>
    `
    await sendNotifyUser({ user: user._id, color: 'red', content: notify })
    logUser(event, user._id, notify)

    // Telebot
    const config = await DB.Config.findOne({}).select('telebot manage_password') as IDBConfig
    const timeFormat = formatDate(event, new Date())
    await botTeleSendMessage(event, {
      url: config.telebot.game.china.payment,
      secret: config.manage_password,
      message: `
        Giao dịch nạp tiền vào Game China
        » Tài khoản: ${user.username}
        » Trò chơi: ${game.name}
        » Mã trò chơi: ${game.code}
        » Mã giao dịch: ${code}
        » Số xu: ${coin.toLocaleString('vi-VN')}
        » Thời gian: ${timeFormat.day}/${timeFormat.month}/${timeFormat.year} - ${timeFormat.hour}:${timeFormat.minute}
      `
    })

    return resp(event, { message: 'Tạo lệnh nạp thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
