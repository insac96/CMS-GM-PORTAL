import type { IAuth, IDBSpend } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Chỉ Admin mới có quyền sửa'

    const body = await readBody(event)
    const { _id, title, money, reason, images, time } = body
    if(!_id || !title || !reason || !time) throw 'Vui lòng nhập đầy đủ thông tin'
    if(!!isNaN(parseInt(money)) || parseInt(money) < 0) throw 'Dữ liệu tiền tệ không hợp lệ'
    if(!Array.isArray(images)) throw 'Dữ liệu hình ảnh không hợp lệ'
    if(reason.length > 50) throw 'Lý do không vượt quá 50 ký tự'

    const spend = await DB.Spend.findOne({ _id: _id }).select('title') as IDBSpend
    if(!spend) throw 'Mục chi tiêu không tồn tại'

    delete body['_id']
    body.time = new Date(time)
    body.user = auth._id
    await DB.Spend.updateOne({ _id: _id }, body)
    
    logAdmin(event, `Sửa thông tin mục chi tiêu <b>${spend.title}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})