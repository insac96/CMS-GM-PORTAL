import type { IAuth, IDBCollabLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id, commission } = body
    if(!_id || !commission) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!commission.game) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      commission.vip < 0
      || commission.game.private < 0
      || commission.game.tool < 0
      || commission.game.china < 0
    ) throw 'Hoa hồng không hợp lệ'

    const level = await DB.CollabLevel.findOne({ _id: _id }).select('number') as IDBCollabLevel
    if(!level) throw 'Cấp độ không tồn tại'

    delete body['_id']
    await DB.CollabLevel.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin cấp độ cộng tác viên <b>${level.number}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})