import type { IAuth, IDBGamePrivate, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id : userID, game : gameID, block } = body
    if(!userID) throw 'Không tìm thấy mã giao dịch'
    if(!gameID) throw 'Không tìm thấy mã trò chơi'

    // Check Game
    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    // Check User
    const user = await DB.GamePrivateUser
    .findOne({ _id: userID, game: game._id })
    .select('user block') 
    .populate({ path: 'user', select: 'username' }) as IDBGamePrivateUser
    if(!user) throw 'Người chơi không tồn tại'

    user.block = block
    await user.save()

    logGameAdmin(event, 'private', game._id, `Sửa thông tin người chơi <b>${user.user.username}</b>`)
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})