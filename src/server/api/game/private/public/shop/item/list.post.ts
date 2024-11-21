import type { IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { size, current, sort, search, game : code } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { pin: -1 }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const match : any = { game: game._id, display: true }
    if(search){
      const listItemMatch = await DB.GamePrivateItem.find({
        '$or' : [
          { 'item_id': { $regex : search.toLowerCase(), $options : 'i' } },
          { 'item_name': { $regex : search.toLowerCase(), $options : 'i' } }
        ]
      })
      match['item'] = { '$in': listItemMatch.map(i => i._id) }
    }

    const list = await DB.GamePrivateShopItem
    .find(match)
    .populate({ path: 'item' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GamePrivateShopItem.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})