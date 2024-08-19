import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Chỉ Admin mới có thể thao tác'

    const data = await readBody(event)
    const { type } = data
    if(!type) throw 'Dữ liệu đầu vào không hợp lệ'

    if(type == 'del-all-notify'){
      await DB.NotifyUser.deleteMany({})
    }

    if(type == 'change-manage-password'){
      if(!data.manage_password) throw 'Vui lòng nhập đủ thông tin'
      await DB.Config.updateMany({}, { manage_password: data.manage_password })
      await logAdmin(event, 'Thao tác <b>đổi mật khẩu</b> ủy quyền')
    }

    return resp(event, { message: 'Thực hiện thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})