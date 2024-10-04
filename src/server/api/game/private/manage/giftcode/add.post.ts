import type { IAuth, IDBGamePrivate, IDBGamePrivateGiftcode } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { code, limit, gift, game: gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!code || !gift) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(limit))|| parseInt(limit) < 0) throw 'Giới hạn không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const upCode = code.trim().toUpperCase()
    const checkCode = await DB.GamePrivateGiftcode.findOne({ code: upCode, game: game._id }).select('_id') as IDBGamePrivateGiftcode
    if(!!checkCode) throw 'Tên mã đã tồn tại'

    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount,
    }))
    body.gift = giftFormat
    body.code = upCode

    await DB.GamePrivateGiftcode.create(body)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})