import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { game : gameID, size, current, sort } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('_id') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { game: game._id }
    const list = await DB.GameToolServerOpen
    .find(match)
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GameToolServerOpen.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})