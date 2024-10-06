import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { size, current, sort, search, game : _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID trò chơi'
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const game = await DB.GamePrivate.findOne({ _id: _id }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)
    
    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { game: game._id }
    if(!!search){
      match['$or'] = [
        { 'recharge_id': { $regex : search.toLowerCase(), $options : 'i' } },
        { 'recharge_name': { $regex : search.toLowerCase(), $options : 'i' } }
      ]
    }

    const list = await DB.GamePrivateRecharge
    .find(match)
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GamePrivateRecharge.count(match)
    return resp(event, { result: { list, total } })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})