import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { game: code, type } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!type) throw 'Không tìm thấy loại trò chơi'

    let DBSelect : any
    if(type == 'tool') DBSelect = DB.GameTool
    if(type == 'private') DBSelect = DB.GamePrivate

    const game = await DBSelect.findOne({ code: code, display: true }).select('_id ip api secret manager')
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'
    await getAuthGM(event, auth, game)

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