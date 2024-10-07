import type { IAuth, IDBGamePrivateUser, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { game : code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'

    // Check Game
    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    // Check Auth
    const auth = await getAuth(event, false)
    if(!auth) return resp(event, { result: null }) 
    
    // Check User Game
    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: (auth as IAuth)._id }) as IDBGamePrivateUser
    if(!userGame) return resp(event, { result: null }) 

    // Check Block
    if(!!userGame.block) throw 'Bạn bị chặn khỏi trò chơi này'
    return resp(event, { result: userGame })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})