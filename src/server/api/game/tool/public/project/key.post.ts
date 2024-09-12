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

    const result = JSON.parse(JSON.stringify(game))
    result.tool = { recharge: false, mail: false }
    const auth = await getAuth(event, false)
    if(!!auth) {
      const userGameTool = await DB.GameToolUser.findOne({
        game: game._id,
        user: (auth as IAuth)._id
      }) as IDBGameToolUser
      if(!!userGameTool) {
        result.tool.recharge = userGameTool.recharge
        result.tool.mail = userGameTool.mail
      }
    }

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})