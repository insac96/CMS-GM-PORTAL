import type { IAuth, IDBGameTool, IDBGameToolServerOpen } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { game : gameID, _id } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('_id') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const openserver = await DB.GameToolServerOpen.findOne({ game: game._id, _id: _id }).select('server_name') as IDBGameToolServerOpen
    if(!openserver) throw 'Lịch mở không tồn tại'
    
    await DB.GameToolServerOpen.deleteOne({ _id: openserver._id })

    logGameAdmin(event, 'tool', game._id, `Xóa lịch mở máy chủ <b>${openserver.server_name}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})