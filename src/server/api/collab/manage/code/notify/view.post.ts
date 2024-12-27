import type { IAuth, IDBCollab, IDBCollabNotify } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { _id, collab : code } = await readBody(event)
    if(!_id ) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!code) throw 'Dữ liệu đầu vào không đủ'
            
    const collab = await DB.Collab.findOne({ code: code }).select('code user') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    const notify = await DB.CollabNotify.findOne({ _id: _id }) as IDBCollabNotify
    if(!notify) throw 'Thông báo không tồn tại'

    return resp(event, { result: notify })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})