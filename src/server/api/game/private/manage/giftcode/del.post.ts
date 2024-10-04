import type { IAuth, IDBGamePrivate, IDBGamePrivateGiftcode } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên'

    const { _id, game: gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const giftcode = await DB.GamePrivateGiftcode.findOne({ _id: _id, game: game._id }).select('_id') as IDBGamePrivateGiftcode
    if(!giftcode) throw 'Mã không tồn tại'
    
    const histories = await DB.GamePrivateGiftcodeHistory.count({ giftcode: giftcode._id })
    if(histories > 0) throw 'Không thể xóa mã đã có lịch sử nhập'

    await DB.GamePrivateGiftcode.deleteOne({ _id: giftcode._id })
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})