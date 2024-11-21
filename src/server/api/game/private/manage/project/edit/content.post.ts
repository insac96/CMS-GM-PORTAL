import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id : gameID, content } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!content) throw 'Dữ liệu đầu vào không đủ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('name manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    await DB.GamePrivate.updateOne({ _id: game._id },{ content: content })

    logGameAdmin(event, 'private', game._id, `Sửa tin tức trò chơi`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})