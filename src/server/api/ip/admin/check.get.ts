export default defineEventHandler(async (event) => {
  try {
    const IP = getRequestIP(event, { xForwardedFor: true })
    const check = await DB.AdminIP.findOne({ ip: IP })
    if(!check) throw `IP ${IP} chưa có trong White List, vui lòng nhập mật khẩu ủy quyển.`

    return resp(event, { result: 'Success' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})