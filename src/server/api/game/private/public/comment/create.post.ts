import type { IAuth, IDBGamePrivate, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { content, game : code } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!content) throw 'Vui lòng nhập bình luận'
    if(content.length < 5) throw 'Bình luận ít nhất 5 ký tự'
    if(content.length > 50) throw 'Bình luận nhiều nhất 50 ký tự'

    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('name') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: auth._id }).select('_id') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi trò chơi trước khi bình luận'

    await DB.GamePrivateComment.create({
      user: userGame._id,
      game: game._id,
      content: content
    })

    logUser({
      user: auth._id,
      action: `Bình luận <b>[Game Private] ${game.name}</b>`,
      type: 'game.private.comment',
      target: game._id.toString()
    })

    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})