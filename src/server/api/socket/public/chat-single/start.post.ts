import type { IAuth, IDBUser, IDBUserLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { to } = await readBody(event)

    const userFrom = await DB.User.findOne({ _id: auth._id })
    .select('level type')
    .populate({ path: 'level', select: 'number' }) as IDBUser
    if(!userFrom) throw 'Người dùng không tồn tại'

    const userTo = await DB.User.findOne({ _id: to })
    .select('level type')
    .populate({ path: 'level', select: 'number' }) as IDBUser
    if(!userTo) throw 'Người dùng không tồn tại'

    if(auth.type < 100){
      if(userTo.type < 100 && (userFrom.level as IDBUserLevel).number < (userTo.level as IDBUserLevel).number) throw 'Bạn không thể khởi tạo cuộc trò chuyện với người có tu vi cao hơn bạn'
    }

    const conversation = await DB.SocketChatSingle.findOne({
      $or: [
        { from: userTo._id, to: auth._id }, 
        { from: auth._id, to: userTo._id }
      ]
    })
    if(!!conversation) return resp(event, { result: conversation._id })

    const newConversation = await DB.SocketChatSingle.create({ from: auth._id, to: userTo._id })
    return resp(event, { result: newConversation._id })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})