import type { IAuth, IDBRoleBody, IDBRolePet, IDBRoleWing, IDBUserLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id, role } = body
    if(!_id || !role) throw 'Dữ liệu đầu vào không hợp lệ'

    const level = await DB.UserLevel.findOne({ _id: _id }).select('number') as IDBUserLevel
    if(!level) throw 'Cấp độ không tồn tại'

    if(!!role.body){
      const roleBody = await DB.RoleBody.findOne({ _id: role.body }).select('_id') as IDBRoleBody
      if(!roleBody) throw 'Trang phục không tồn tại'
    }

    if(!!role.wing){
      const roleWing = await DB.RoleWing.findOne({ _id: role.wing }).select('_id') as IDBRoleWing
      if(!roleWing) throw 'Cánh không tồn tại'
    }

    if(!!role.pet){
      const rolePet = await DB.RolePet.findOne({ _id: role.pet }).select('_id') as IDBRolePet
      if(!rolePet) throw 'Thú cưng không tồn tại'
    }

    delete body['_id']
    await DB.UserLevel.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin ngoại hình cấp độ <b>${level.number}</b>`)

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})