import type { IAuth, IDBGamePrivate, IDBGamePrivateItem, IDBGamePrivateShopItem } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { item, amount, price, limit, game : gameID  } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!item || !price) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(amount)) || parseInt(amount) < 1) throw 'Số lượng không hợp lệ'
    if(!!isNaN(parseInt(price)) || parseInt(price) < 1) throw 'Giá tiền không hợp lệ'
    if(!!isNaN(parseInt(limit))|| parseInt(limit) < 0) throw 'Giới hạn không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const itemData = await DB.GamePrivateItem.findOne({ _id: item, game: game._id }).select('_id') as IDBGamePrivateItem
    if(!itemData) throw 'Vật phẩm không tồn tại'

    const checkDup = await DB.GamePrivateShopItem.findOne({ item: itemData._id, game: game._id }).select('_id') as IDBGamePrivateShopItem
    if(!!checkDup) throw 'Vật phẩm cửa hàng đã tồn tại'

    await DB.GamePrivateShopItem.create(body)

    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})