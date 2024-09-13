import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { game: code, type } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!type) throw 'Không tìm thấy loại trò chơi'

    let DBSelect : any
    if(type == 'tool') DBSelect = DB.GameTool

    const game = await DBSelect.findOne({ code: code, display: true }).select('_id ip api secret')
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const os = await gameGetOS(event, {
      url: game.api.os,
      secret: game.secret,
    })
    return resp(event, { result: os })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})