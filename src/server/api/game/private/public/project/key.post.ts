import type { IAuth, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { key } = await readBody(event)
    if(!key) throw 'Không tìm thấy khóa trò chơi'

    const game = await DB.GamePrivate
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

    const auth = await getAuth(event, false)
    if(!!auth) {
      const userGame = await DB.GamePrivateUser.findOne({
        game: game._id, user: (auth as IAuth)._id
      }) as IDBGamePrivateUser

      if(!!userGame) result.user = userGame
      else result.user = null
    }

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})