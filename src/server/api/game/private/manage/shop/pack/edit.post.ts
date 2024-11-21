import type { IAuth, IDBGamePrivate, IDBGamePrivateShopPack } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, name, price, limit, gift, game: gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id || !name || !price || !gift) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(price)) || parseInt(price) < 1) throw 'Giá tiền không hợp lệ'
    if(!!isNaN(parseInt(limit))|| parseInt(limit) < 0) throw 'Giới hạn không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const shopPack = await DB.GamePrivateShopPack.findOne({ _id: _id, game: game._id }).select('name') as IDBGamePrivateShopPack
    if(!shopPack) throw 'Vật phẩm cửa hàng không tồn tại'

    delete body['_id']
    delete body['game']
    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount
    }))
    body.gift = giftFormat
    await DB.GamePrivateShopPack.updateOne({ _id: shopPack._id }, body)

    logGameAdmin(event, 'private', game._id, `Sửa gói vật phẩm <b>${shopPack.name}</b> ở cửa hàng`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})