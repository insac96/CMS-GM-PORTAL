import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    await DB.NotifyUser.deleteMany({ user: auth._id })
    return resp(event, { message: 'Xóa tin nhắn cá nhân thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})