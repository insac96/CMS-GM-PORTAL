import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { size, current, sort, search, game : gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('manager') as IDBGameTool
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

    const list = await DB.GameToolRecharge
    .find(match)
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GameToolRecharge.count(match)
    return resp(event, { result: { list, total } })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})