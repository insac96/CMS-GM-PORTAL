import type { IAuth, IDBGameTool, IDBGameToolRecharge } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, game : gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('manager') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const recharge = await DB.GameToolRecharge.findOne({ _id: _id, game: game._id }).select('recharge_name') as IDBGameToolRecharge
    if(!recharge) throw 'Gói không tồn tại'

    await DB.GameToolRecharge.deleteOne({ _id: recharge._id })

    logGameAdmin(event, 'tool', game._id, `Xóa gói nạp <b>${recharge.recharge_name}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})