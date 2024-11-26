import type { IAuth, IDBSocketChatSingle } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { conversation : _id, text } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID cuộc trò chuyện'
    if(!text) throw 'Vui lòng nhập nội dung'
    if(text.length > 100) throw 'Nội dung không vượt quá 100 ký tự'

    const conversation = await DB.SocketChatSingle.findOne({ _id: _id }) as IDBSocketChatSingle
    if(!conversation) throw 'Cuộc trò chuyện không tồn tại' 
    if(
      conversation.from.toString() != auth._id.toString()
      && conversation.to.toString() != auth._id.toString()
    ) throw 'Bạn không có quyền tham gia cuộc trò chuyện'
    
    const newMessage = await DB.SocketChatSingleMessage.create({ 
      conversation: conversation._id, 
      content: text,
      user: auth._id
    })

    const sendTo = conversation.from.toString() == auth._id.toString() ? conversation.to.toString() : conversation.from.toString()
    if(sendTo != auth._id.toString()) IO.to(sendTo).emit('chat-single-push', newMessage)

    return resp(event, { result: newMessage })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})