import { IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { password } = await readBody(event)
    if(!password) throw 'Vui lòng nhập đầy đủ thông tin'

    const config = await DB.Config.findOne().select('manage_password') as IDBConfig
    if(password != config.manage_password) throw 'Mã ủy quyền không hợp lệ'
    return resp(event, { message: 'Xác thực quản trị viên thành công', result: '/manage/@eni' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})