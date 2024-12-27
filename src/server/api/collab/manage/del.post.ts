import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 100) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const collab = await DB.Collab.findOne({ _id: _id }).select('code')
    if(!collab) throw 'Mã cộng tác viên không tồn tại'

    const user = await DB.User.count({ 'reg.collab': collab._id })
    if(user > 0) throw 'Không thể xóa nguồn quảng cáo đã có người tương tác'

    await DB.Collab.deleteOne({ _id: _id })

    await logAdmin(event, `Xóa mã cộng tác viên <b>${collab.code}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})