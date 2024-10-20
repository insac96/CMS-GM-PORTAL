import jwt from 'jsonwebtoken'
import type { IAuth, IDBGameTool, IDBGameToolUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, type } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!type) throw 'Không tìm thấy hệ điều hành chơi'

    const game = await DB.GameTool.findOne({ code: code, display: true }).select('_id ip api secret play statistic') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const userGame = await DB.GameToolUser.findOne({ user: auth._id, game: game._id }) as IDBGameToolUser
    if(!userGame) {
      await DB.GameToolUser.create({ user: auth._id, game: game._id })
      await DB.GameTool.updateOne({ _id: game._id }, { $inc: { 'statistic.user': 1 } })
    }

    // Get URL Play
    let result : any
    if(type == 'web'){
      const url = await gameStart(event, {
        url: game.api.start,
        secret: game.secret,
        account: auth.username
      })
      const token = jwt.sign({ url : url }, game.secret, { expiresIn: '360d' })
      result = { token }
    }
    else {
      // @ts-expect-error
      if(!game.play || !game.play[type]) throw 'Trò chơi không hỗ trợ chơi trên nền tảng này'
      // @ts-expect-error
      const download = game.play[type]
      result = { download }
    }

    // Update Play
    game.statistic.play = game.statistic.play + 1
    // @ts-expect-error
    await game.save()

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})