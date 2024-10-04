import type { IAuth, IDBGamePrivate, IDBGamePrivateItemBox } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên'

    const { _id, game: gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const itembox = await DB.GamePrivateItemBox.findOne({ _id: _id, game: game._id }).select('name') as IDBGamePrivateItemBox
    if(!itembox) throw 'Gói không tồn tại'

    await DB.GamePrivateItemBox.deleteOne({ _id: itembox._id })
    
    return resp(event, { message: 'Xóa thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})