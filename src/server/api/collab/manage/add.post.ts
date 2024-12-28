import type { IAuth, IDBCollabLevel, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 100) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { code, note, user, level } = body
    if(!code || !note || !user || !level) throw 'Dữ liệu đầu vào sai'

    const userCheck = await DB.User.findOne({ _id: user }).select('_id') as IDBUser
    if(!userCheck) throw 'Không tìm thấy người dùng'

    const levelCheck = await DB.CollabLevel.findOne({ _id: level }).select('_id') as IDBCollabLevel
    if(!levelCheck) throw 'Không tìm thấy thông tin cấp độ'
    
    const checkDup = await DB.Collab.findOne({ code: code }).select('_id')
    if(!!checkDup) throw 'Mã cộng tác viên đã tồn tại'

    await DB.Collab.create(body)
    
    await logAdmin(event, `Thêm mã cộng tác viên <b>${code}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})