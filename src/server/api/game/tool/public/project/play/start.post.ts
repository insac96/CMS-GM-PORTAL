import md5 from "md5"
import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GameTool.findOne({ code: code, display: true }).select('_id ip api secret statistic') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const url = await gameStart(event, {
      url: game.api.start,
      secret: game.secret,
      account: auth.username
    })
    game.statistic.play = game.statistic.play + 1

    // @ts-expect-error
    await game.save()

    const token = md5(`${url}.${auth.username}.${game.secret}`)
    return resp(event, { result: { url, token } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})