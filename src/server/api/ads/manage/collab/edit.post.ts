import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 100) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, code, note } = body
    if(!_id || !code || !note) throw 'Dữ liệu đầu vào không hợp lệ'

    const collab = await DB.AdsCollab.findOne({ _id: _id }).select('code')
    if(!collab) throw 'Mã cộng tác viên không tồn tại'

    if(collab.code != code){
      const checkDup = await DB.AdsCollab.findOne({ code: code }).select('_id')
      if(!!checkDup) throw 'Mã cộng tác viên đã tồn tại'
    }

    delete body['_id']
    await DB.AdsCollab.updateOne({ _id: _id }, body)
    
    await logAdmin(event, `Sửa mã cộng tác viên <b>${collab.code}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})