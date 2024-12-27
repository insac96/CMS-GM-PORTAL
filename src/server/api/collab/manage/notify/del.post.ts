import type { IAuth, IDBCollabNotify } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const notify = await DB.CollabNotify.findOne({ _id: _id }).select('title') as IDBCollabNotify
    if(!notify) throw 'Thông báo không tồn tại'

    await DB.CollabNotify.deleteOne({ _id: _id })
    logAdmin(event, `Xóa thông báo nền tảng <b>${notify.title}</b>`)

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})