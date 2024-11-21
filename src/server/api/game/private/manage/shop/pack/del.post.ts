import type { IAuth, IDBGamePrivate, IDBGamePrivateShopPack } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id, game : gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const shopPack = await DB.GamePrivateShopPack.findOne({ _id: _id, game: game._id }).select('name') as IDBGamePrivateShopPack
    if(!shopPack) throw 'Vật phẩm cửa hàng không tồn tại'
    
    const histories = await DB.GamePrivateShopPackHistory.count({ pack: shopPack._id, game: game._id })
    if(histories > 0) throw 'Không thể xóa gói đã có lịch sử mua hàng'

    await DB.GamePrivateShopPack.deleteOne({ _id: shopPack._id })

    logGameAdmin(event, 'private', game._id, `Xóa gói vật phẩm <b>${shopPack.name}</b> khỏi cửa hàng`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})