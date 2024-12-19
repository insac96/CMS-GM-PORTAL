import type { IAuth, IDBGamePrivate, IDBGamePrivateItem } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, item_id, item_name, item_image, game : gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id) throw 'Không tìm thấy ID vật phẩm'
    if(!item_id || !item_name) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const item = await DB.GamePrivateItem.findOne({ _id: _id, game: game._id }) as IDBGamePrivateItem
    if(!item) throw 'Vật phẩm không tồn tại'

    item.item_id = item_id
    item.item_name = item_name
    item.item_image = item_image

    // @ts-expect-error
    await item.save()

    logGameAdmin(event, 'private', game._id, `Sửa vật phẩm trò chơi <b>${item.item_name}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})