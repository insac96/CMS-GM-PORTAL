import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { number, title, exp, limit } = body
    if(!number || !title || !exp || !limit) throw 'Dữ liệu đầu vào không hợp lệ'
    if(number < 1) throw 'Cấp độ không hợp lệ'
    if(exp < 1) throw 'Cấp độ không hợp lệ'

    const getByNumber = await DB.UserLevel.findOne({ number: number }).select('_id')
    if(!!getByNumber) throw 'Cấp độ đã tồn tại'

    await DB.UserLevel.create(body)
    logAdmin(event, `Thêm cấp độ <b>${number}</b>`)
    
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})