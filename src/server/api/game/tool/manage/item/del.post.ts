import type { IAuth, IDBGameTool, IDBGameToolItem } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, game : gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id) throw 'Không tìm thấy ID vật phẩm'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('manager') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const item = await DB.GameToolItem.findOne({ _id: _id, game: game._id }).select('item_name') as IDBGameToolItem
    if(!item) throw 'Vật phẩm không tồn tại'

    await DB.GameToolItem.deleteOne({ _id: item._id })

    logGameAdmin(event, 'tool', game._id, `Xóa vật phẩm trò chơi <b>${item.item_name}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})