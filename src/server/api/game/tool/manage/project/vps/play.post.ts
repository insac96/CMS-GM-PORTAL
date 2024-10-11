import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { account, game: code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!account) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GameTool.findOne({ code: code }).select('_id ip api play secret manager') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'
    if(!game.play.web) throw 'Trò chơi không hỗ trợ chơi ngay'
    await getAuthGM(event, auth, game)

    const url = await gameStart(event, {
      url: game.api.start,
      secret: game.secret,
      account: account
    })

    return resp(event, { result: url })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})