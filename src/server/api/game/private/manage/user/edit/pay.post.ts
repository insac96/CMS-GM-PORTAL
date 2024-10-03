import type { IAuth, IDBGamePrivate, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id : userID, game : gameID,  pay } = body
    if(!userID) throw 'Không tìm thấy mã giao dịch'
    if(!gameID) throw 'Không tìm thấy mã trò chơi'
    if(!pay) throw 'Dữ liệu đầu vào không hợp lệ'
    const { day, week, month, total } = pay
    if(!day || !week || !month || !total) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(day.coin))
      || !!isNaN(parseInt(week.coin))
      || !!isNaN(parseInt(month.coin))
      || !!isNaN(parseInt(total.coin))
      || parseInt(day.coin) < 0
      || parseInt(week.coin) < 0
      || parseInt(month.coin) < 0
      || parseInt(total.coin) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    // Check Game
    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    // Check User
    const user = await DB.GamePrivateUser.findOne({ _id: userID, game: game._id }).select('_id') as IDBGamePrivateUser
    if(!user) throw 'Người chơi không tồn tại'

    // Update
    await DB.GamePrivateUser.updateOne({ _id: user._id }, {
      'pay.day.coin' : parseInt(day.coin),
      'pay.week.coin' : parseInt(week.coin),
      'pay.month.coin' : parseInt(month.coin),
      'pay.total.coin' : parseInt(total.coin),
    })

    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})