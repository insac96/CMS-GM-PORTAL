import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id: gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('name') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    await DB.GameToolUser.deleteMany({ game: game._id })
    await DB.GameToolPayment.deleteMany({ game: game._id })
    await DB.GameToolRecharge.deleteMany({ game: game._id })
    await DB.GameToolItem.deleteMany({ game: game._id })
    await DB.GameToolComment.deleteMany({ game: game._id })
    await DB.GameTool.deleteOne({ _id: game._id })

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})