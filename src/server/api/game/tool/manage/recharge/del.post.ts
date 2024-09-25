import type { IAuth, IDBGameTool, IDBGameToolRecharge } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id, game : game_id } = body
    if(!game_id) throw 'Không tìm thấy ID trò chơi'
    if(!_id) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GameTool.findOne({ _id: game_id }).select('_id') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const recharge = await DB.GameToolRecharge.findOne({ _id: _id, game: game._id }).select('_id') as IDBGameToolRecharge
    if(!recharge) throw 'Gói không tồn tại'

    await DB.GameToolRecharge.deleteOne({ _id: recharge._id })
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})