import type { IAuth, IDBCollabNotify } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id, title } = body
    if(!_id || !title ) throw 'Dữ liệu đầu vào không hợp lệ'

    const notify = await DB.CollabNotify.findOne({ _id: _id }).select('title') as IDBCollabNotify
    if(!notify) throw 'Thông báo không tồn tại'

    delete body['_id']
    await DB.CollabNotify.updateOne({ _id: _id }, body)
    logAdmin(event, `Sửa thông báo nền tảng <b>${notify.title}</b>`)

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})