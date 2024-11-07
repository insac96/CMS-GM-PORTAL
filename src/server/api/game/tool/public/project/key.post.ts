import type { IAuth, IDBGameToolUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { key } = await readBody(event)
    if(!key) throw 'Không tìm thấy khóa trò chơi'

    const game = await DB.GameTool
    .findOneAndUpdate(
      { key: key, display: true }, 
      { $inc: { 'statistic.view': 1 } }, 
      { new: true }
    )
    .populate({ path: 'platform', select: 'name key' })
    .populate({ path: 'category', select: 'name key' })
    .select('-ip -port -secret -api')
    if(!game) throw 'Trò chơi không tồn tại'

    const newserver = await DB.GameToolServerOpen
    .findOne({ game: game._id })
    .sort({ opentime: -1 })

    const result = JSON.parse(JSON.stringify(game))
    result.tool = { recharge: false, mail: false }
    result.newserver = newserver

    const auth = await getAuth(event, false)
    if(!!auth) {
      const userGame = await DB.GameToolUser.findOne({ game: game._id, user: (auth as IAuth)._id }) as IDBGameToolUser

      if(!!userGame) {
        result.tool.recharge = userGame.recharge
        result.tool.mail = userGame.mail
      }
    }

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})