import { IDBGamePrivate, IDBGamePrivateShopItem, IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, amount, price, limit, game : gameID } = body
    if(!_id || !price) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(amount)) || parseInt(amount) < 1) throw 'Số lượng không hợp lệ'
    if(!!isNaN(parseInt(price)) || parseInt(price) < 1) throw 'Giá tiền không hợp lệ'
    if(!!isNaN(parseInt(limit)) || parseInt(limit) < 0) throw 'Giới không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const shopItem = await DB.GamePrivateShopItem
    .findOne({ _id: _id, game: game._id })
    .select('item') 
    .populate({ path: 'item', select: 'item_name'}) as IDBGamePrivateShopItem
    if(!shopItem) throw 'Vật phẩm cửa hàng không tồn tại'

    delete body['_id']
    delete body['game']
    await DB.GamePrivateShopItem.updateOne({ _id: shopItem._id }, body)

    // @ts-expect-error
    logGameAdmin(event, 'private', game._id, `Sửa vật phẩm <b>${shopItem.item.item_name}</b> ở cửa hàng`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})