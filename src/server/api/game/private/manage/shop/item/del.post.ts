import type { IAuth, IDBGamePrivate, IDBGamePrivateShopItem } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id, game : gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const shopItem = await DB.GamePrivateShopItem
    .findOne({ _id: _id, game: game._id })
    .select('item') 
    .populate({ path: 'item', select: 'item_name'}) as IDBGamePrivateShopItem
    if(!shopItem) throw 'Vật phẩm cửa hàng không tồn tại'

    const historyCount = await DB.GamePrivateShopItemHistory.count({ item: shopItem.item, game: game._id })
    if(historyCount > 0) throw 'Không thể xóa vật phẩm đã có lịch sử mua hàng'

    await DB.GamePrivateShopItem.deleteOne({ _id: shopItem._id })

    // @ts-expect-error
    logGameAdmin(event, 'private', game._id, `Xóa vật phẩm <b>${shopItem.item.item_name}</b> khỏi cửa hàng`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})