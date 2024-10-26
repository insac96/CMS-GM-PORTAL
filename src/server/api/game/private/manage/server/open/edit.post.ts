import type { IAuth, IDBGamePrivate, IDBGamePrivateServerOpen } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id, game : gameID, server_name, opentime } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id || !server_name || !opentime) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const openserver = await DB.GamePrivateServerOpen.findOne({ game: game._id, _id: _id }).select('_id') as IDBGamePrivateServerOpen
    if(!openserver) throw 'Lịch mở không tồn tại'

    delete body['_id']
    delete body['game']
    await DB.GamePrivateServerOpen.updateOne({ _id: openserver._id }, body)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})