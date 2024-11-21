import type { IAuth, IDBGameChina } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id : gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GameChina.findOne({ _id: gameID }).select('name') as IDBGameChina
    if(!game) throw 'Trò chơi không tồn tại'

    await DB.GameChinaUser.deleteMany({ game: game._id })
    await DB.GameChinaPayment.deleteMany({ game: game._id })
    await DB.GameChinaComment.deleteMany({ game: game._id })
    await DB.GameChinaLogAdmin.deleteMany({ game: game._id })
    await DB.GameChina.deleteOne({ _id: game._id })

    logAdmin(event, `Xóa trò chơi China <b>${game.name}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})