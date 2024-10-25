import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { text } = await readBody(event)
    if(!text) throw 'Vui lòng nhập nội dung'
    if(text.length > 100) throw 'Nội dung không vượt quá 100 ký tự'

    const user = await DB.User
    .findOne({ _id: auth._id })
    .select('username avatar type level')
    .populate({ path: 'level' }) as IDBUser

    const chat = await DB.SocketChatGlobal.create({ user: auth._id, content: text })
    const result = JSON.parse(JSON.stringify(chat))
    result.user = user
    IO.emit('chat-global-push', result)

    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})