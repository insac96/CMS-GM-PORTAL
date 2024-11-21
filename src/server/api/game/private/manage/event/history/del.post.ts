import type { IAuth, IDBGamePrivate, IDBGamePrivateEventHistory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id, game: gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const history = await DB.GamePrivateEventHistory
    .findOne({ _id: _id, game: game._id })
    .select('event user')
    .populate({ path: 'user', select: 'user', populate: { path: 'user', select: 'username' }})
    .populate({ path: 'event', select: 'type need' }) as IDBGamePrivateEventHistory
    if(!history) throw 'Lịch sử không tồn tại'
    
    await DB.GamePrivateEventHistory.deleteOne({ _id: history._id })

    // @ts-expect-error
    logGameAdmin(event, 'private', game._id, `Xóa lịch sử nhận mốc <b>${history.event.need}</b> trong sự kiện <b>${history.event.type}</b> của tài khoản <b>${history.user.user.username}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})