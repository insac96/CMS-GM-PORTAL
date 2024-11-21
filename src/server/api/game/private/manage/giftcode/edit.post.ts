import type { IAuth, IDBGamePrivate, IDBGamePrivateGiftcode } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, code, limit, gift, game: gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id || !code) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(limit))|| parseInt(limit) < 0) throw 'Giới hạn không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const giftcode = await DB.GamePrivateGiftcode.findOne({ _id: _id, game: game._id }).select('code') as IDBGamePrivateGiftcode
    if(!giftcode) throw 'Mã không tồn tại'

    const upCode = code.trim().toUpperCase()
    if(giftcode.code != upCode){
      const checkCode = await DB.GamePrivateGiftcode.findOne({ code: upCode, game: game._id }).select('_id') as IDBGamePrivateGiftcode
      if(!!checkCode) throw 'Tên mã đã tồn tại'
    }

    delete body['game']
    delete body['_id']
    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount,
    }))
    body.gift = giftFormat
    body.code = upCode

    await DB.GamePrivateGiftcode.updateOne({ _id: giftcode._id }, body)

    logGameAdmin(event, 'private', game._id, `Sửa mã Giftcode <b>${giftcode.code}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})