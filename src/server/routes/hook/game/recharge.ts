import type { IDBShop, IDBItem, IDBShopConfig, IDBLevel, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { account, role, item_id, item_name, price, server } = await readBody(event)
    if(!account) throw 'Không tìm thấy tên tài khoản'
    if(!item_id) throw 'Không tìm thấy ID vật phẩm'
    if(!server) throw 'Không tìm thấy thông tin máy chủ'
    if(!role) throw 'Không tìm thấy thông tin nhân vật'

    // Check Item And Create
    let item = await DB.Item.findOne({ item_id: item_id, type: 'game_recharge' }).select('item_name item_image type') as IDBItem
    if(!item){
      if(!item_name || !price) throw 'Vật phẩm không hỗ trợ'

      item = await DB.Item.create({ item_id: item_id, item_name: item_name, type: 'game_recharge' })
      await DB.Shop.create({ item: item._id, price: price }) as IDBShop
    }

    // Shop Config
    const shopConfig = await DB.ShopConfig.findOne() as IDBShopConfig
    if(!shopConfig) throw 'Không tìm thấy cấu hình cửa hàng'
    if(!!shopConfig.maintenance) throw 'Cửa hàng đang bảo trì, vui lòng quay lại sau'

    // Check User
    const user = await DB.User.findOne({ username: account }).select('currency.coin currency.diamond level spend') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    const level = await DB.Level.findOne({ _id: user.level }).select('limit.spend discount') as IDBLevel
    if(!level) throw 'Không tìm thấy thông tin cấp độ'

    // Shop Item Data
    const shopData = await DB.Shop
    .findOne({ item: item._id }) 
    .select('item item_amount price limit')
    .populate({ path: 'item', select: 'item_id item_name type' }) as IDBShop
    if(!shopData) throw 'Vật phẩm không tồn tại'

    // Total Price
    const priceBuy = shopData.price
    const discountLevel = level.discount
    const discountSystem = getShopDiscount(event, shopConfig)
    const discount = discountLevel + discountSystem > 100 ? 100 : discountLevel + discountSystem
    const totalPrice = Math.floor(priceBuy - Math.floor(priceBuy * discount / 100))
    if(totalPrice > user.currency.coin) throw 'Số dư không đủ'

    // Check Limit Spend
    const spend = user.spend
    const limit = level.limit.spend
    const limitCoinDay = limit.day.coin == 0 ? -1 : (limit.day.coin - spend.day.coin) < 0 ? 0 : (limit.day.coin - spend.day.coin)
    const limitCountyDay = limit.day.count == 0 ? -1 : (limit.day.count - spend.day.count) < 0 ? 0 : (limit.day.count - spend.day.count)
    const limitCoinMonth = limit.month.coin == 0 ? -1 : (limit.month.coin - spend.month.coin) < 0 ? 0 : (limit.month.coin - spend.month.coin)
    const limitCountMonth = limit.month.count == 0 ? -1 : (limit.month.count - spend.month.count) < 0 ? 0 : (limit.month.count - spend.month.count)
  
    if(limitCountyDay != -1 && limitCountyDay <= 0) throw 'Bạn đã hết lượt tiêu phí hôm nay'
    if(limitCoinDay != -1 && limitCoinDay <= 0) throw 'Bạn đã đạt giới hạn tiêu phí hôm nay'
    if(limitCoinDay != -1 && totalPrice > limitCoinDay) throw `Hôm nay bạn chỉ có thể tiêu tối đa ${limitCoinDay.toLocaleString("vi-VN")} Xu`
    if(limitCountMonth != -1 && limitCountMonth <= 0) throw 'Bạn đã hết lượt tiêu phí tháng này'
    if(limitCoinMonth != -1 && limitCoinMonth <= 0) throw 'Bạn đã đạt giới hạn tiêu phí tháng này'
    if(limitCoinMonth != -1 && totalPrice > limitCoinMonth) throw `Tháng này bạn chỉ có thể tiêu tối đa ${limitCoinMonth.toLocaleString("vi-VN")} Xu`

    // Send Item
    const itemData = shopData.item as IDBItem
    await gameSendRecharge(event, {
      account: account,
      server_id: server.toString(),
      role_id: role.toString(),
      recharge_id: itemData.item_id,
      save_pay: shopData.price
    })

    // Update User
    await DB.User.updateOne({ _id: user._id },{
      $inc: {
        'currency.coin': totalPrice * -1,
        'spend.total.coin': totalPrice,
        'spend.day.coin': totalPrice,
        'spend.month.coin': totalPrice,
        'spend.total.count': 1,
        'spend.day.count': 1,
        'spend.month.count': 1,
      }
    })

    // History
    await DB.ShopHistory.create({
      user: user._id,
      item: itemData._id,
      server: server,
      role: role,
      price: totalPrice,
      amount: 1
    })

    logUser(event, user._id, `Dùng <b>${totalPrice.toLocaleString("vi-VN")} Xu</b> để mua <b>x1 ${itemData.item_name}</b> tại máy chủ <b>${server}</b> nhân vật <b>${role}</b>`)
    return resp(event, { message: 'Mua vật phẩm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})