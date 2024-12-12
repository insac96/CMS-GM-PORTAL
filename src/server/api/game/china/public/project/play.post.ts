import type { IAuth, IDBGameChina, IDBGameChinaUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { game : code, type } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!type) throw 'Không tìm thấy hệ điều hành chơi'

    const game = await DB.GameChina.findOne({ code: code, display: true }).select('name play statistic') as IDBGameChina
    if(!game) throw 'Trò chơi không tồn tại'

    // @ts-expect-error
    if(!game.play || !game.play[type]) throw 'Trò chơi không hỗ trợ chơi trên nền tảng này'
    // @ts-expect-error
    const url = game.play[type]

    game.statistic.play = game.statistic.play + 1
    // @ts-expect-error
    await game.save()

    const userGameChina = await DB.GameChinaUser.findOne({ user: auth._id, game: game._id }) as IDBGameChinaUser
    if(!userGameChina) {
      await DB.GameChinaUser.create({ user: auth._id, game: game._id })
      await DB.GameChina.updateOne({ _id: game._id }, { $inc: { 'statistic.user': 1 } })

      logUser({
        user: auth._id,
        action: `Đăng ký chơi <b>[Game China] ${game.name}</b>`,
        type: 'game.china.play',
        target: game._id.toString()
      })
    }

    return resp(event, { result: { url } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})