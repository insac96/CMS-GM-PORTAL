import type { IAuth, IDBGamePrivate, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id : userID, game : gameID,  spend } = body
    if(!userID) throw 'Không tìm thấy mã giao dịch'
    if(!gameID) throw 'Không tìm thấy mã trò chơi'
    if(!spend) throw 'Dữ liệu đầu vào không hợp lệ'
    const { day, week, month, total } = spend
    if(!day || !week || !month || !total) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(day.gcoin))
      || !!isNaN(parseInt(week.gcoin))
      || !!isNaN(parseInt(month.gcoin))
      || !!isNaN(parseInt(total.gcoin))
      || parseInt(day.gcoin) < 0
      || parseInt(week.gcoin) < 0
      || parseInt(month.gcoin) < 0
      || parseInt(total.gcoin) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    // Check Game
    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    // Check User
    const user = await DB.GamePrivateUser.findOne({ user: userID, game: game._id }).select('_id') as IDBGamePrivateUser
    if(!user) throw 'Người chơi không tồn tại'

    // Update
    await DB.GamePrivateUser.updateOne({ _id: user._id }, {
      'spend.day.gcoin' : parseInt(day.gcoin),
      'spend.week.gcoin' : parseInt(week.gcoin),
      'spend.month.gcoin' : parseInt(month.gcoin),
      'spend.total.gcoin' : parseInt(total.gcoin),
    })

    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})