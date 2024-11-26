import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { to } = await readBody(event)

    const userTo = await DB.User.findOne({ _id: to }).select('_id') as IDBUser
    if(!userTo) throw 'Người dùng không tồn tại'

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