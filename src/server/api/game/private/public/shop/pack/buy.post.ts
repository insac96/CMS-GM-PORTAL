import type { IAuth, IDBUser, IDBGamePrivate, IDBGamePrivateItem, IDBGamePrivateShopPack, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, shop : shopPackID, amount, server, role } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!shopPackID) throw 'Không tìm thấy mã vật phẩm bày bán'
    if(!server || !role) throw 'Vui lòng chọn máy chủ và nhân vật'
    if(!!isNaN(parseInt(amount)) || parseInt(amount) < 1) throw 'Số lượng không hợp lệ'
    if(amount > 1000) throw 'Số lượng không vượt quá 1000'

    const user = await DB.User.findOne({ _id: auth._id }).select('currency vip') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    
    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('ip api secret rate') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: auth._id }).select('_id') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi trò chơi trước khi mua'

    const shopPack = await DB.GamePrivateShopPack
    .findOne({ _id: shopPackID, game: game._id, display: true })
    .populate({ path: 'gift.item', select: 'item_id' }) as IDBGamePrivateShopPack
    if(!shopPack) throw 'Gói vật phẩm bày bán không tồn tại'

    // Discount VIP
    const vip = await getUserVip(user) as string
    // @ts-expect-error
    const discountVIP = !!vip ? game.rate.shop.vip[vip] : 0

    // Make Total Price
    const price = shopPack.price * parseInt(amount)
    let discount = formatRate(game.rate.shop) + discountVIP
    discount = discount > 100 ? 100 : discount
    let totalPrice = price - Math.floor(price * (discount / 100))
    if(!runtimeConfig.public.dev && auth.type == 100) totalPrice = 0 // Admin Free

    // Check Currency
    if(user.currency.coin < totalPrice) throw 'Số dư coin không đủ'

    // Check Limit Buy
    if(shopPack.limit > 0){
      if(parseInt(amount) > shopPack.limit) throw `Không thể mua quá số lượng ${shopPack.limit} gói`
      const now = DayJS(Date.now())
      const start = now.startOf('date')
      const end = now.endOf('date')
      const matchTime = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }

      const historyDay = await DB.GamePrivateShopPackHistory.aggregate([
        { $match: { user: userGame._id, pack: shopPack._id, createdAt: matchTime }},
        { $project: {
          createdAt: 1, amount: 1,
          timeformat: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }}
        }},
        { $group: { _id: '$timeformat', count: { $sum: '$amount' }}},
      ])

      if(!!historyDay[0] && historyDay[0].count >= shopPack.limit) throw `Hôm nay bạn đã đạt giới hạn mua gói này`
    }

    // Format Gift
    const giftItem : Array<any> = []
    shopPack.gift.forEach(gift => {
      const item = gift.item as IDBGamePrivateItem
      giftItem.push({ id: item.item_id, amount: gift.amount * parseInt(amount)})
    })

    // Send Recharge
    await gameSendMail(event, {
      url: game.api.mail,
      secret: game.secret,
      account: auth.username,
      server_id: server,
      role_id: role,
      title: 'Web Shop',
      content: 'Vật phẩm mua từ Web Shop',
      items: giftItem
    })

    // Update User
    await DB.User.updateOne({ _id: auth._id }, { $inc: {
      'currency.coin': totalPrice * -1,
    }})
    await DB.GamePrivateUser.updateOne({ _id: userGame._id },{ $inc: {
      'spend.day.coin': totalPrice,
      'spend.week.coin': totalPrice,
      'spend.month.coin': totalPrice,
      'spend.total.coin': totalPrice,
      'spend.day.count': 1,
      'spend.week.count': 1,
      'spend.month.count': 1,
      'spend.total.count': 1,
    }})

    // Update Revenue
    await DB.GamePrivate.updateOne({ _id: game._id }, { $inc: { 'statistic.revenue': totalPrice }})

    // History
    await DB.GamePrivateShopPackHistory.create({
      user: userGame._id,
      game: game._id,
      pack: shopPack._id,
      price: totalPrice,
      amount: amount,
      server: server,
      role: role,
    })

    return resp(event, { message: 'Mua thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})