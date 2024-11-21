import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { name, price, limit, gift, game: gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!name || !price || !gift) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(price)) || parseInt(price) < 1) throw 'Giá tiền không hợp lệ'
    if(!!isNaN(parseInt(limit))|| parseInt(limit) < 0) throw 'Giới hạn không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount,
    }))
    body.gift = giftFormat

    await DB.GamePrivateShopPack.create(body)

    logGameAdmin(event, 'private', game._id, `Thêm gói vật phẩm <b>${name}</b> vào cửa hàng`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})