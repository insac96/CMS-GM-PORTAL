import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { name, icon, path, power } = body
    if(!name || !path) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!path.frame || !path.json) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(power)) || parseInt(power) < 0) throw 'Dữ liệu lực chiến không hợp lệ'

    await DB.RoleBody.create(body)
    logAdmin(event, `Thêm ngoại hình trang phục <b>${name}</b>`)
    
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})