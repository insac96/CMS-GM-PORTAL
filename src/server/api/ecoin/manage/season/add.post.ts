import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { title, time, ecoin, vnd } = body
    if(!title || !time) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!time.start || !time.end) throw 'Dữ liệu thời gian không hợp lệ'
    if(!!isNaN(parseInt(ecoin)) || parseInt(ecoin) < 0) throw 'Dữ liệu Ecoin không hợp lệ'
    if(!!isNaN(parseInt(vnd)) || parseInt(vnd) < 1) throw 'Dữ liệu tổng cung không hợp lệ'

    await DB.EcoinSeason.create(body)
    logAdmin(event, `Thêm mua giải Ecoin mới <b>${title}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})