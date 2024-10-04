import type { IAuth, IDBUser, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { server_id, user, game: code, type } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!type) throw 'Không tìm thấy loại trò chơi'
    if(!server_id) throw 'Dữ liệu đầu vào sai'

    let DBSelect : any
    if(type == 'tool') DBSelect = DB.GameTool
    if(type == 'private') DBSelect = DB.GamePrivate

    const game = await DBSelect.findOne({ code: code, display: true }).select('_id ip api secret')
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    let accountGet
    if(!!user){
      const userData = await DB.User.findOne({ _id: user }).select('username') as IDBUser
      if(!userData) throw 'Tài khoản không tồn tại'
      accountGet = userData.username
    }
    else accountGet = auth.username

    const list = await gameGetRole(event, {
      url: game.api.role,
      secret: game.secret,
      server_id: server_id,
      account: accountGet
    })

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})