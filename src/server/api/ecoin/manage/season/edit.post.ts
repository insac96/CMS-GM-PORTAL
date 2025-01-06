import type { IAuth, IDBEcoinSeason } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id, title, time, ecoin, vnd } = body
    if(!_id || !title || !time) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!time.start || !time.end) throw 'Dữ liệu thời gian không hợp lệ'
    if(!!isNaN(parseInt(ecoin)) || parseInt(ecoin) < 0) throw 'Dữ liệu Ecoin không hợp lệ'
    if(!!isNaN(parseInt(vnd)) || parseInt(vnd) < 1) throw 'Dữ liệu tổng cung không hợp lệ'

    const season = await DB.EcoinSeason.findOne({ _id: _id }).select('title') as IDBEcoinSeason
    if(!season) throw 'Mùa giải không tồn tại'

    delete body['_id']
    await DB.EcoinSeason.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin mùa giải Ecoin <b>${season.title}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})