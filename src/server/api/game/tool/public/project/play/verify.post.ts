import md5 from "md5"
import type { IAuth, IDBGameTool, IDBGameToolUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, token } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GameTool
    .findOne({ code: code, display: true })
    .select('-content -play -price -statistic -pin -display -description -category -platform') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const url = await gameStart(event, {
      url: game.api.start,
      secret: game.secret,
      account: auth.username
    })
    const tokenCheck = md5(`${url}.${auth.username}.${game.secret}`)
    if(tokenCheck != token) throw true

    const result = JSON.parse(JSON.stringify(game))
    result.tool = { recharge: false, mail: false }
    if(!!auth) {
      const userGameTool = await DB.GameToolUser.findOne({
        game: game._id,
        user: auth._id
      }) as IDBGameToolUser
      if(!!userGameTool) {
        result.tool.recharge = userGameTool.recharge
        result.tool.mail = userGameTool.mail
      }
    }

    delete result['ip']
    delete result['port']
    delete result['api']
    delete result['secret']

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})