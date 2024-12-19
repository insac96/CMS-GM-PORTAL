import type { IDBUser, IDBGamePrivate, IDBGamePrivateRecharge, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const body = await readBody(event)

    const { account, code : gameCode, item_id, item_name, price, save_pay, server, role } = body
    if(!gameCode) throw 'Không tìm thấy mã trò chơi'
    if(!item_id || !item_name || !price) throw 'Gói nạp không hợp lệ'
    if(!server || !role) throw 'Vui lòng chọn máy chủ và nhân vật'

    const user = await DB.User.findOne({ username: account }).select('currency vip type') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    
    const game = await DB.GamePrivate.findOne({ code: gameCode, display: true }).select('name ip api secret rate') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: user._id }).select('currency') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi trò chơi trước khi mua'

    let recharge = await DB.GamePrivateRecharge.findOne({ recharge_id: item_id, game: game._id}) as IDBGamePrivateRecharge
    if(!recharge){
      recharge = await DB.GamePrivateRecharge.create({ 
        game: game._id,
        recharge_id: item_id,
        recharge_name: item_name,
        save_pay: save_pay || price,
        price: price,
      })
    }

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
    if(!runtimeConfig.public.dev && user.type == 100) totalPrice = 0 // Admin Free

    // Check Currency
    if(user.currency.coin < totalPrice) throw 'Số dư coin không đủ'

    // Send Recharge
    await gameSendRecharge(event, {
      url: game.api.recharge,
      secret: game.secret,
      account: user.username,
      server_id: server,
      role_id: role,
      recharge_id: recharge.recharge_id,
      save_pay: recharge.save_pay
    })

    // Update User
    await DB.User.updateOne({ _id: user._id }, { $inc: {
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

    // Log User
    logUser({
      user: user._id,
      action: `Dùng <b>${totalPrice.toLocaleString("vi-VN")} Xu</b> mua hàng trong <b>[Game Private] ${game.name}</b>`,
      type: 'game.private.shopping',
      target: game._id.toString()
    })

    return resp(event, { message: 'Mua thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})