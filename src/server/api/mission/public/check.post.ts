import { IDBMission } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { mission: _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
    throw 'Tính năng sắp ra mắt'

    const mission = await DB.Mission.findOne({ _id: _id, display: true }) as IDBMission
    if(!mission) throw 'Nhiệm vụ không tồn tại'

    return resp(event, { result: 1, message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})