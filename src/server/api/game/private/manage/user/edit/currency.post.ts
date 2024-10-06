import type { IAuth, IDBGamePrivate, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id : userID, game : gameID,  type, plus, origin } = body
    if(!userID) throw 'Không tìm thấy mã giao dịch'
    if(!gameID) throw 'Không tìm thấy mã trò chơi'
    if(type != 'plus' && type != 'origin') throw 'Kiểu chỉnh sửa không hợp lệ'
    if(!plus || !origin) throw 'Dữ liệu đầu vào sai'

    // Check Game
    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    // Check User
    const user = await DB.GamePrivateUser.findOne({ _id: userID, game: game._id }).select('_id') as IDBGamePrivateUser
    if(!user) throw 'Người chơi không tồn tại'

    // Update
    if(type == 'plus'){
      if(!!isNaN(parseInt(plus.gcoin))) throw 'Dữ liệu tiền tệ không hợp lệ'
      await DB.GamePrivateUser.updateOne({ _id: user._id }, {
        '$inc' : {
          'currency.gcoin' : parseInt(plus.gcoin)
        }
      })
    }
    if(type == 'origin'){
      if(!!isNaN(parseInt(origin.gcoin)) || parseInt(origin.gcoin) < 0) throw 'Dữ liệu tiền tệ không hợp lệ'
      await DB.GamePrivateUser.updateOne({ _id: user._id }, {
        'currency.gcoin' : parseInt(origin.gcoin)
      })
    }

    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})