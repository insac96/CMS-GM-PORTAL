import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id : gameID, ip, port, secret } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!ip || !port || !secret) throw 'Dữ liệu đầu vào không đủ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('name manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    delete body['_id']
    body.api = {
      start: `http://${ip}:${port}/api/action/start.php?type=private`,
      server: `http://${ip}:${port}/api/action/server.php?type=private`,
      role: `http://${ip}:${port}/api/action/role.php?type=private`,
      roles: `http://${ip}:${port}/api/action/roles.php?type=private`,
      mail: `http://${ip}:${port}/api/action/mail.php?type=private`,
      recharge: `http://${ip}:${port}/api/action/recharge.php?type=private`,
      level: `http://${ip}:${port}/api/action/rank_level.php?type=private`,
      power: `http://${ip}:${port}/api/action/rank_power.php?type=private`,
      os: `http://${ip}:${port}/api/action/os.php?type=private`
    }

    await DB.GamePrivate.updateOne({ _id: game._id }, body)

    logGameAdmin(event, 'private', game._id, `Sửa API trò chơi`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})