import type { IAuth, IDBGameTool, IDBGameToolUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, items, server_id, role_id } = body
    
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!items) throw 'Không tìm thấy vật phẩm để gửi'
    if(!Array.isArray(items)) throw 'Định dạng vật phẩm không đúng'
    
    const game = await DB.GameTool.findOne({ code: code, display: true }).select('_id ip api secret') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const userGameTool = await DB.GameToolUser.findOne({ game: game._id, user: auth._id }) as IDBGameToolUser
    if(!userGameTool) throw 'Bạn chưa mua bất cứ tool nào'
    if(!userGameTool.mail) throw 'Vui lòng mua tool gửi thư trước'

    await gameSendMail(event, {
      url: game.api.mail,
      secret: game.secret,
      account: auth.username,
      server_id: server_id,
      role_id: role_id,
      title: 'Thư Tool',
      content: 'Vật phẩm gửi từ tool',
      items: items
    })

    return resp(event, { message: 'Gửi thư thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})