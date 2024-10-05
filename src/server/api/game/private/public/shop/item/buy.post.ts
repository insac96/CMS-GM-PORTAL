import type { IAuth, IDBGamePrivate, IDBGamePrivateItem, IDBGamePrivateShopItem, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, shop : shopItemID, amount, server, role } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!shopItemID) throw 'Không tìm thấy mã vật phẩm bày bán'
    if(!server || !role) throw 'Vui lòng chọn máy chủ và nhân vật'
    if(!!isNaN(parseInt(amount)) || parseInt(amount) < 1) throw 'Số lượng không hợp lệ'
    if(amount > 1000) throw 'Số lượng không vượt quá 1000'
    
    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('ip api secret rate') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: auth._id }).select('currency') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi trò chơi trước khi mua'

    const shopItem = await DB.GamePrivateShopItem.findOne({ _id: shopItemID, game: game._id }) as IDBGamePrivateShopItem
    if(!shopItem) throw 'Vật phẩm bày bán không tồn tại'

    const item = await DB.GamePrivateItem.findOne({ _id: shopItem.item, game: game._id }) as IDBGamePrivateItem
    if(!item) throw 'Vật phẩm trò chơi không tồn tại'

    // Make Total Price
    const price = shopItem.price * parseInt(amount)
    let discount = formatRate(game.rate.shop)
    discount = discount > 100 ? 100 : discount
    const totalPrice = price - Math.floor(price * (discount / 100))

    // Check Currency
    if(userGame.currency.gcoin < totalPrice) throw 'Số dư GCoin không đủ'

    // Check Limit Buy
    if(shopItem.limit > 0){
      const countBuy = await DB.GamePrivateShopItemHistory.count({ user: userGame._id, item: item._id, server: server })
      if(countBuy >= shopItem.limit) throw `Bạn đã đạt giới hạn mua lại vật phẩm này`
    }

    // Send Recharge
    await gameSendMail(event, {
      url: game.api.mail,
      secret: game.secret,
      account: auth.username,
      server_id: server,
      role_id: role,
      title: 'Web Shop',
      content: 'Vật phẩm mua từ Web Shop',
      items: [{ id: item.item_id, amount: parseInt(amount) * (shopItem.amount || 1) }]
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
    await DB.GamePrivateShopItemHistory.create({
      user: userGame._id,
      game: game._id,
      item: item._id,
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