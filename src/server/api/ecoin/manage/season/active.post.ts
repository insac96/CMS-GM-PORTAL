import type { IAuth, IDBEcoinSeason } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const season = await DB.EcoinSeason.findOne({ _id: _id }).select('title') as IDBEcoinSeason
    if(!season) throw 'Mùa giải không tồn tại'

    await DB.EcoinSeason.updateMany({}, { active: false })
    await DB.EcoinSeason.updateOne({ _id: _id }, { active: true })
    logAdmin(event, `Kích hoạt mùa giải <b>${season.title}</b>`)

    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})