import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { key, game : code } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const match : any = { game: game._id }
    if(!!key){
      match['$or'] = [
        { item_name: { $regex : key, $options : 'i' }},
        { item_id: { $regex : key, $options : 'i' }},
      ]
    }

    const items = await DB.GamePrivateItem.find(match).select('item_id item_name item_image').limit(20)
    return resp(event, { result: items })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})