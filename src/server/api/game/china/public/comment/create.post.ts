import type { IAuth, IDBGameChina, IDBGameChinaUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { content, game : code } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!content) throw 'Vui lòng nhập bình luận'
    if(content.length < 5) throw 'Bình luận ít nhất 5 ký tự'
    if(content.length > 50) throw 'Bình luận nhiều nhất 50 ký tự'

    const game = await DB.GameChina.findOne({ code: code, display: true }).select('_id') as IDBGameChina
    if(!game) throw 'Trò chơi không tồn tại'

    const userGame = await DB.GameChinaUser.findOne({ game: game._id, user: auth._id }).select('_id') as IDBGameChinaUser
    if(!userGame) throw 'Vui lòng chơi trò chơi trước khi bình luận'

    await DB.GameChinaComment.create({
      user: userGame._id,
      game: game._id,
      content: content
    })

    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})