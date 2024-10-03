import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id, ip, port, secret } = body
    if(!_id || !ip || !port || !secret) throw 'Dữ liệu đầu vào không đủ'

    const game = await DB.GamePrivate.findOne({ _id: _id }).select('name')
    if(!game) throw 'Trò chơi không tồn tại'

    delete body['_id']
    body.api = {
      start: `http://${ip}:${port}/api/action/start.php`,
      server: `http://${ip}:${port}/api/action/server.php`,
      role: `http://${ip}:${port}/api/action/role.php`,
      roles: `http://${ip}:${port}/api/action/roles.php`,
      mail: `http://${ip}:${port}/api/action/mail.php`,
      recharge: `http://${ip}:${port}/api/action/recharge.php`,
      level: `http://${ip}:${port}/api/action/rank_level.php`,
      power: `http://${ip}:${port}/api/action/rank_power.php`,
      os: `http://${ip}:${port}/api/action/os.php`
    }

    await DB.GamePrivate.updateOne({ _id: _id }, body)

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})