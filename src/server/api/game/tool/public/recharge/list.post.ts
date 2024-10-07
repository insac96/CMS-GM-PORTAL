import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { size, current, sort, search, game : code } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const game = await DB.GameTool.findOne({ code: code, display: true }).select('_id') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const match : any = { game: game._id }
    if(search){
      match['$text'] = { '$search': search }
    }

    const list = await DB.GameToolRecharge
    .find(match)
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GameToolRecharge.count()
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})