import type { IAuth, IDBGameTool, IDBGameToolRecharge, IDBGameToolUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, recharge : recharge_id, server_id, role_id } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!recharge_id) throw 'Không tìm thấy mã gói nạp'
    
    const game = await DB.GameTool.findOne({ code: code, display: true }).select('_id ip api secret') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const userGameTool = await DB.GameToolUser.findOne({ game: game._id, user: auth._id }) as IDBGameToolUser
    if(!userGameTool) throw 'Bạn chưa mua bất cứ tool nào'
    if(!userGameTool.recharge) throw 'Vui lòng mua tool nạp trước'

    const rechargeGameTool = await DB.GameToolRecharge.findOne({ _id: recharge_id, game: game._id }) as IDBGameToolRecharge
    if(!rechargeGameTool) throw 'Gói nạp không tồn tại'

    await gameSendRecharge(event, {
      url: game.api.recharge,
      secret: game.secret,
      account: auth.username,
      server_id: server_id,
      role_id: role_id,
      recharge_id: rechargeGameTool.recharge_id,
      save_pay: rechargeGameTool.save_pay
    })

    return resp(event, { message: 'Nạp vào trò chơi thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})