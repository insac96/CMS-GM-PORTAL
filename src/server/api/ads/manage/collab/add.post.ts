import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 100) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { code, note, user } = body
    if(!code || !note || !user) throw 'Dữ liệu đầu vào sai'

    const userCheck = await DB.User.findOne({ _id: user }).select('_id')
    if(!userCheck) throw 'Không tìm thấy người dùng'

    const checkDup = await DB.AdsCollab.findOne({ code: code }).select('_id')
    if(!!checkDup) throw 'Mã cộng tác viên đã tồn tại'

    await DB.AdsCollab.create(body)
    
    await logAdmin(event, `Thêm mã cộng tác viên <b>${code}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})