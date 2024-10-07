import type { IAuth, IDBGameChina } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { key } = await readBody(event)
    if(!key) throw 'Không tìm thấy khóa trò chơi'

    const game = await DB.GameChina.findOne({ key: key })
    .populate({ path: 'platform', select: 'name key'})
    .populate({ path: 'category', select: 'name key'}) as IDBGameChina
    
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    return resp(event, { result: game })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})