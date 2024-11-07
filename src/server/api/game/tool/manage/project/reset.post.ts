import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id: gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('name') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    // await DB.GameToolServerOpen.deleteMany({ game: game._id })
    await DB.GameToolUser.deleteMany({ game: game._id })
    await DB.GameToolPayment.deleteMany({ game: game._id })
    await DB.GameToolComment.deleteMany({ game: game._id })
    await DB.GameTool.updateOne({ _id: game._id },{
      statistic: {
        play: 0,
        view: 0,
        user: 0,
        revenue: 0,
      },
    })

    return resp(event, { message: 'Reset thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})