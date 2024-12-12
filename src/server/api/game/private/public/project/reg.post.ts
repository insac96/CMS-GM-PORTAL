import type { IAuth, IDBGamePrivateUser, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { game : code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GamePrivate
    .findOne({ code: code, display: true })
    .select('price name') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const userGame = await DB.GamePrivateUser
    .findOne({ game: game._id, user: auth._id })
    .select('_id') as IDBGamePrivateUser
    if(!!userGame) throw 'Bạn đã đăng ký trò chơi này rồi'

    const newUserGame = await DB.GamePrivateUser.create({ game: game._id, user: auth._id })
    await DB.GamePrivate.updateOne({ _id: game._id }, { $inc: { 'statistic.user': 1 } })

    IO.emit('notify-global-push', `<b class="text-primary-500">${auth.username}</b> đăng ký chơi trò chơi Private <b class="text-primary-500">${game.name}</b>`)

    logUser({
      user: auth._id,
      action: `Đăng ký chơi <b>[Game Private] ${game.name}</b>`,
      type: 'game.private.play',
      target: game._id.toString()
    })

    return resp(event, { result: newUserGame })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})