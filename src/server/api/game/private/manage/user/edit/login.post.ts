import type { IAuth, IDBGamePrivate, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id : userID, game : gameID, login } = body
    if(!userID) throw 'Không tìm thấy mã giao dịch'
    if(!gameID) throw 'Không tìm thấy mã trò chơi'
    if(!login) throw 'Dữ liệu đầu vào không hợp lệ'
    const { week, month, total } = login
    if(!week || !month || !total) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(week))
      || !!isNaN(parseInt(month))
      || !!isNaN(parseInt(total))
      || parseInt(week) < 0
      || parseInt(month) < 0
      || parseInt(total) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    // Check Game
    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    // Check User
    const user = await DB.GamePrivateUser.findOne({ _id: userID, game: game._id }).select('_id') as IDBGamePrivateUser
    if(!user) throw 'Người chơi không tồn tại'

    // Update
    await DB.GamePrivateUser.updateOne({ _id: user._id }, {
      'login.week' : parseInt(week),
      'login.month' : parseInt(month),
      'login.total' : parseInt(total),
    })

    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})