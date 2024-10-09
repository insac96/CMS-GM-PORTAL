import type { IAuth, IDBGameChina, IDBGameChinaUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort, search, range, game : key } = await readBody(event)
    if(!key) throw 'Không tìm thấy mã trò chơi'
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    // Check Game
    const game = await DB.GameChina.findOne({ key: key, display: true }).select('_id') as IDBGameChina
    if(!game) throw 'Trò chơi không tồn tại'

    // Check User
    const userGame = await DB.GameChinaUser.findOne({ game: game._id, user: auth._id }).select('_id') as IDBGameChinaUser
    if(!userGame) throw 'Chưa có dữ liệu chơi trò chơi'
    
    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { user: userGame._id, game: game._id }
    if(search.key && search.by){
      match['code'] = { $regex : search.key.toLowerCase(), $options : 'i' }
    }
    if(!!range && !!range['start'] && !!range['end']){
      match['createdAt'] = { $gte: new Date(range['start']), $lte: new Date(range['end']) }
    }

    const list = await DB.GameChinaPayment
    .find(match)
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GameChinaPayment.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})