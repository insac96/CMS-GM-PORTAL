import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { item_id, item_name, item_image, game : gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!item_id || !item_name) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    await DB.GamePrivateItem.create({
      item_id: item_id,
      item_name: item_name,
      item_image: item_image,
      game: game._id
    })

    logGameAdmin(event, 'private', game._id, `Thêm vật phẩm trò chơi <b>${item_name}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})