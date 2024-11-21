import type { IAuth, IDBGamePrivate, IDBGamePrivateEvent } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id, game: gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const eventData = await DB.GamePrivateEvent.findOne({ _id: _id, game: game._id }).select('type need') as IDBGamePrivateEvent
    if(!eventData) throw 'Mốc sự kiện không tồn tại'
    
    const histories = await DB.GamePrivateEventHistory.count({ event: eventData._id })
    if(histories > 0) throw 'Không thể mốc đã có lịch sử nhập'

    await DB.GamePrivateEvent.deleteOne({ _id: eventData._id })

    logGameAdmin(event, 'private', game._id, `Xóa mốc <b>${eventData.need}</b> của sự kiện <b>${eventData.type}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})