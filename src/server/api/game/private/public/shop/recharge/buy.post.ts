import type { IAuth, IDBUser, IDBGamePrivate, IDBGamePrivateRecharge, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, recharge : rechargeID, server, role } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!rechargeID) throw 'Không tìm thấy mã gói nạp'
    if(!server || !role) throw 'Vui lòng chọn máy chủ và nhân vật'

    const user = await DB.User.findOne({ _id: auth._id }).select('currency vip') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    
    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('ip api secret rate') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: auth._id }).select('currency') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi trò chơi trước khi mua'

    const recharge = await DB.GamePrivateRecharge.findOne({ _id: rechargeID, game: game._id, display: true }) as IDBGamePrivateRecharge
    if(!recharge) throw 'Gói nạp game không tồn tại'

    // Discount VIP
    const vip = await getUserVip(user) as string
    // @ts-expect-error
    const discountVIP = !!vip ? game.rate.shop.vip[vip] : 0

    // Make Total Price
    let rate = formatRate(game.rate.shop)
    rate = rate > 100 ? 100 : rate
    let discount = formatRate(game.rate.shop) + discountVIP
    discount = discount > 100 ? 100 : discount
    let totalPrice = recharge.price - Math.floor(recharge.price * (discount / 100))
    let totalSpend = recharge.price - Math.floor(recharge.price * (rate / 100))
    if(!runtimeConfig.public.dev && auth.type == 100) totalPrice = 0 // Admin Free

    // Check Currency
    if(user.currency.coin < totalPrice) throw 'Số dư coin không đủ'

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
    await DB.User.updateOne({ _id: auth._id }, { $inc: {
      'currency.coin': totalPrice * -1,
    }})
    await DB.GamePrivateUser.updateOne({ _id: userGame._id },{ $inc: {
      'spend.day.coin': totalSpend,
      'spend.week.coin': totalSpend,
      'spend.month.coin': totalSpend,
      'spend.total.coin': totalSpend,
      'spend.day.count': 1,
      'spend.week.count': 1,
      'spend.month.count': 1,
      'spend.total.count': 1,
    }})

    // Update Revenue
    await DB.GamePrivate.updateOne({ _id: game._id }, { $inc: { 'statistic.revenue': totalPrice }})

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