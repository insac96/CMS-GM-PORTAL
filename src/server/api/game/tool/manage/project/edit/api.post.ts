import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id : gameID, ip, port, secret } = body
    if(!gameID) throw 'Không tìm thấy mã trò chơi'
    if(!ip || !port || !secret) throw 'Dữ liệu đầu vào không đủ'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('name manager') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    delete body['_id']
    body.api = {
      start: `http://${ip}:${port}/api/action/start.php?type=tool`,
      server: `http://${ip}:${port}/api/action/server.php?type=tool`,
      role: `http://${ip}:${port}/api/action/role.php?type=tool`,
      roles: `http://${ip}:${port}/api/action/roles.php?type=tool`,
      mail: `http://${ip}:${port}/api/action/mail.php?type=tool`,
      recharge: `http://${ip}:${port}/api/action/recharge.php?type=tool`,
      os: `http://${ip}:${port}/api/action/os.php?type=tool`
    }

    logGameAdmin(event, 'tool', game._id, `Sửa API trò chơi`)
    await DB.GameTool.updateOne({ _id: game._id }, body)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})