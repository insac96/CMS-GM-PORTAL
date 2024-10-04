import type { IAuth, IDBGamePrivateUser, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { game : code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: auth._id }) as IDBGamePrivateUser
    if(!userGame) throw 'Bạn chưa đăng ký trò chơi này'

    return resp(event, { result: userGame })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})