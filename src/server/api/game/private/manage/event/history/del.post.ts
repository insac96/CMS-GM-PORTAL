import type { IAuth, IDBGamePrivate, IDBGamePrivateEventHistory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id, game: gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const history = await DB.GamePrivateEventHistory.findOne({ _id: _id, game: game._id }).select('_id') as IDBGamePrivateEventHistory
    if(!history) throw 'Lịch sử không tồn tại'
    
    await DB.GamePrivateEventHistory.deleteOne({ _id: history._id })
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})