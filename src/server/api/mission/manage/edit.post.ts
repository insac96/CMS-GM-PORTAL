import type { IAuth, IDBMission } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id, title, description, type, gift } = body
    if(!_id || !title || !description || !type || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const mission = await DB.Mission.findOne({ _id: _id }) as IDBMission
    if(!mission) throw 'Nhiệm vụ không tồn tại'

    delete body['_id']
    await DB.Mission.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa nhiệm vụ <b>${mission.title}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})