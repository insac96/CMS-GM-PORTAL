import type { IAuth, IDBRoleWing } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id, name, icon, path, power } = body
    if(!_id || !name || !path) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!path.frame || !path.json) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(power)) || parseInt(power) < 0) throw 'Dữ liệu lực chiến không hợp lệ'

    const roleWing = await DB.RoleWing.findOne({ _id: _id }).select('name') as IDBRoleWing
    if(!roleWing) throw 'Ngoại hình cánh không tồn tại'

    delete body['_id']
    await DB.RoleWing.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa ngoại hình cánh <b>${roleWing.name}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})