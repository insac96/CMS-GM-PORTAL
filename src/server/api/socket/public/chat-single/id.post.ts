import type { IAuth, IDBSocketChatSingle } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID cuộc trò chuyện'

    const conversation = await DB.SocketChatSingle.findOne({ _id: _id })
    .populate({ path: 'from', select: 'username avatar type level vip', populate: { path: 'level' } })
    .populate({ path: 'to', select: 'username avatar type level vip', populate: { path: 'level' } }) as IDBSocketChatSingle

    if(!conversation) throw 'Cuộc trò chuyện không tồn tại' 
    if(
      conversation.from._id.toString() != auth._id.toString()
      && conversation.to._id.toString() != auth._id.toString()
    ) throw 'Bạn không có quyền truy cập cuộc trò chuyện'

    const messages = await DB.SocketChatSingleMessage.find({ conversation: conversation._id })
    return resp(event, { result: { conversation, messages } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})