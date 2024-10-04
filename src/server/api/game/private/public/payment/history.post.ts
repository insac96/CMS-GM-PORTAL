import type { IAuth, IDBGamePrivate, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort, search, user, range, game : key } = await readBody(event)
    if(!key) throw 'Không tìm thấy mã trò chơi'
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const game = await DB.GamePrivate.findOne({ key: key, display: true }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const userCheck = (!!user && auth.type > 0) ? user : auth._id
    const userGame = await DB.GamePrivateUser.findOne({ user: userCheck, game: game._id }).select('_id') as IDBGamePrivateUser
    
    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { user: userGame._id, game: game._id }
    if(search.key){
      match['code'] = { $regex : search.key.toLowerCase(), $options : 'i' }
    }
    if(!!range && !!range['start'] && !!range['end']){
      match['createdAt'] = { $gte: new Date(range['start']), $lte: new Date(range['end']) }
    }

    const list = await DB.GamePrivatePayment
    .find(match)
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GamePrivatePayment.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})