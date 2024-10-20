import type { IAuth, IDBGamePrivate, IDBGamePrivateRecharge, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, recharge : rechargeID, server, role } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!rechargeID) throw 'Không tìm thấy mã gói nạp'
    if(!server || !role) throw 'Vui lòng chọn máy chủ và nhân vật'
    
    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('ip api secret rate') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: auth._id }).select('currency') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi trò chơi trước khi mua'

    const recharge = await DB.GamePrivateRecharge.findOne({ _id: rechargeID, game: game._id, display: true }) as IDBGamePrivateRecharge
    if(!recharge) throw 'Gói nạp game không tồn tại'

    // Make Total Price
    let discount = formatRate(game.rate.shop)
    discount = discount > 100 ? 100 : discount
    let totalPrice = recharge.price - Math.floor(recharge.price * (discount / 100))
    if(!runtimeConfig.public.dev && auth.type == 100) totalPrice = 0 // Admin Free

    // Check Currency
    if(userGame.currency.gcoin < totalPrice) throw 'Số dư GCoin không đủ'

    // Send Recharge
    await gameSendRecharge(event, {
      url: game.api.recharge,
      secret: game.secret,
      account: auth.username,
      server_id: server,
      role_id: role,
      recharge_id: recharge.recharge_id,
      save_pay: recharge.save_pay
    })

    // Update User
    await DB.GamePrivateUser.updateOne({ _id: userGame._id },{ $inc: {
      'currency.gcoin': totalPrice * -1,
      'spend.day.gcoin': totalPrice,
      'spend.week.gcoin': totalPrice,
      'spend.month.gcoin': totalPrice,
      'spend.total.gcoin': totalPrice,
      'spend.day.count': 1,
      'spend.week.count': 1,
      'spend.month.count': 1,
      'spend.total.count': 1,
    }})

    // History
    await DB.GamePrivateRechargeHistory.create({
      user: userGame._id,
      game: game._id,
      recharge: recharge._id,
      price: totalPrice,
      server: server,
      role: role,
    })

    return resp(event, { message: 'Mua thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})