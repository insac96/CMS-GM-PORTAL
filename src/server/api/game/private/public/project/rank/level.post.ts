import gameGetRankLevel from "~~/src/server/utils/gameGetRankLevel"
import type { IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { server_id, game: code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!server_id) throw 'Không tìm thất ID máy chủ'

    const game = await DB.GamePrivate.findOne({ code: code }).select('_id ip api secret') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const url = await gameGetRankLevel(event, {
      url: game.api.level,
      secret: game.secret,
      server_id: server_id
    })

    return resp(event, { result: url })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})