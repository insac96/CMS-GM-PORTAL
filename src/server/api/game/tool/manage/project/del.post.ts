import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GameTool.findOne({ _id: _id }).select('name') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    await DB.GameToolUser.deleteMany({ game: game._id })
    await DB.GameToolRecharge.deleteMany({ game: game._id })
    await DB.GameToolItem.deleteMany({ game: game._id })
    await DB.GameTool.deleteOne({ _id: _id })

    logAdmin(event, `Xóa trò chơi <b>${game.name}</b>`)

    return resp(event, { message: 'Xóa trò chơi thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})