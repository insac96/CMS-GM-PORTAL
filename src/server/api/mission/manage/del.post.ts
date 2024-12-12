import type { IAuth, IDBMission } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const mission = await DB.Mission.findOne({ _id: _id }).select('title') as IDBMission
    if(!mission) throw 'Nhiệm vụ không tồn tại'

    await DB.MissionHistory.deleteMany({ mission: mission._id })
    await DB.Mission.deleteOne({ _id: mission._id })
    logAdmin(event, `Xóa nhiệm vụ <b>${mission.title}</b>`)

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})