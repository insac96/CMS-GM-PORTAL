import type { IDBUser, IDBGameTool, IDBGameToolUser, IDBGameToolRecharge } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { account, code : gameCode, item_id, item_name, price, save_pay, server, role } = body
    if(!gameCode) throw 'Không tìm thấy mã trò chơi'
    if(!item_id || !item_name || !price) throw 'Gói nạp không hợp lệ'
    if(!server || !role) throw 'Vui lòng chọn máy chủ và nhân vật'

    const user = await DB.User.findOne({ username: account }).select('_id') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    
    const game = await DB.GameTool.findOne({ code: gameCode, display: true }).select('ip api secret') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const userGame = await DB.GameToolUser.findOne({ game: game._id, user: user._id }) as IDBGameToolUser
    if(!userGame) throw 'Bạn chưa mua bất cứ tool nào'
    if(!userGame.recharge) throw 'Vui lòng mua tool nạp trước'

    let recharge = await DB.GameToolRecharge.findOne({ recharge_id: item_id, game: game._id}) as IDBGameToolRecharge
    if(!recharge){
      recharge = await DB.GameToolRecharge.create({ 
        game: game._id,
        recharge_id: item_id,
        recharge_name: item_name,
        save_pay: save_pay || price
      })
    }

    await gameSendRecharge(event, {
      url: game.api.recharge,
      secret: game.secret,
      account: account,
      server_id: server,
      role_id: role,
      recharge_id: recharge.recharge_id,
      save_pay: recharge.save_pay
    })

    return resp(event, { message: 'Mua thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})