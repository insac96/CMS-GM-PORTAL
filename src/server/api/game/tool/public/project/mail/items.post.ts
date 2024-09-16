import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GameTool.findOne({ code: code, display: true }).select('ip api secret') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const data = await gameGetItems(event, {
      url: game.api.start,
      secret: game.secret
    })

    return resp(event, { result: data })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})