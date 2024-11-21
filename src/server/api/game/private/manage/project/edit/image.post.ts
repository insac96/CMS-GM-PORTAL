import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id : gameID, review } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!review) throw 'Dữ liệu đầu vào không đủ'
    if(!Array.isArray(review)) throw 'Dữ liệu hình ảnh review không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('name manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    delete body['_id']
    await DB.GamePrivate.updateOne({ _id: game._id }, { image: body })

    logGameAdmin(event, 'private', game._id, `Sửa hình ảnh trò chơi`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})