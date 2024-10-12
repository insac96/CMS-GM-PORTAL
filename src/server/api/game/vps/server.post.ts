import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { game: code, type } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!type) throw 'Không tìm thấy loại trò chơi'

    let DBSelect : any
    if(type == 'tool') DBSelect = DB.GameTool
    if(type == 'private') DBSelect = DB.GamePrivate

    const game = await DBSelect.findOne({ code: code, display: true }).select('_id ip api secret')
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const list = await gameGetServer(event, {
      url: game.api.server,
      secret: game.secret,
    })
    
    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})