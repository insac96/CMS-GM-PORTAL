import type { IAuth, IDBGamePrivate, IDBGamePrivateGiftcode, IDBUser, IDBUserLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào sai'

    const chat = await DB.SocketChatGlobal.findOne({ _id: _id }).select('_id')
    if(!chat) throw 'Đoạn tin nhắn không tồn tại'

    await DB.SocketChatGlobal.deleteOne({ _id: chat._id })

    IO.emit('chat-global-del', chat._id)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})