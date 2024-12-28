import type { IAuth, IDBCollab, IDBCollabLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 100) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, code, note, level} = body
    if(!_id || !code || !note || !level) throw 'Dữ liệu đầu vào không hợp lệ'

    const collab = await DB.Collab.findOne({ _id: _id }).select('code level') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'

    if(collab.code != code){
      const checkDup = await DB.Collab.findOne({ code: code }).select('_id') as IDBCollab
      if(!!checkDup) throw 'Mã cộng tác viên đã tồn tại'
    }
    
    if(!!collab.level && collab.level.toString() != level.toString()){
      const levelCheck = await DB.CollabLevel.findOne({ _id: level }).select('_id') as IDBCollabLevel
      if(!levelCheck) throw 'Không tìm thấy thông tin cấp độ'
    }

    delete body['_id']
    await DB.Collab.updateOne({ _id: _id }, body)
    
    await logAdmin(event, `Sửa mã cộng tác viên <b>${collab.code}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})