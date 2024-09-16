import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    await DB.NotifyUser.updateOne({ user: auth._id }, { watched: true })
    return resp(event, { message: 'Cập nhật xem tất cả thông báo thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})