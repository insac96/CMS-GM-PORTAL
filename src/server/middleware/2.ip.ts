export default defineEventHandler(async (event) => {
  try {
    const IP = getRequestIP(event, { xForwardedFor: true })
    const IPBlock = await DB.BlockIP.findOne({ ip: IP }).select('_id')
    if(!!IPBlock) throw 'Bạn bị chặn quyền truy cập'
  }
  catch (e:any) {
    return resp(event, { code: 511, message: e.toString() })
  }
})