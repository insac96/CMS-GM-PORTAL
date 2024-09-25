import type { IAuth, IDBGameToolUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { key } = await readBody(event)
    if(!key) throw 'Không tìm thấy khóa trò chơi'

    const game = await DB.GameTool
    .findOne({ key: key, display: true })
    .populate({ path: 'platform', select: 'name key' })
    .populate({ path: 'category', select: 'name key' })
    if(!game) throw 'Trò chơi không tồn tại'

    return resp(event, { result: game })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})