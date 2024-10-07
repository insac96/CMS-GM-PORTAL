import type { IAuth, IDBGameChina, IDBGameChinaUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { key } = await readBody(event)
    if(!key) throw 'Không tìm thấy khóa trò chơi'

    const game = await DB.GameChina
    .findOneAndUpdate(
      { key: key, display: true }, 
      { $inc: { 'statistic.view': 1 } }, 
      { new: true }
    )
    .populate({ path: 'platform', select: 'name key' })
    .populate({ path: 'category', select: 'name key' }) as IDBGameChina
    if(!game) throw 'Trò chơi không tồn tại'

    const result = JSON.parse(JSON.stringify(game))
    const auth = await getAuth(event, false) as IAuth | null
    if(!!auth){
      const userGame = await DB.GameChinaUser.findOne({ user: (auth as IAuth)._id, game: game._id }).select('_id') as IDBGameChinaUser
      if(!!userGame) result.user = true
    }

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})