import type { IAuth, IDBGamePrivate } from "~~/types"
import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { size, current, sort, search, game : gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { game: new Types.ObjectId(game._id) }
    if(search){
      match['item.name'] = { $regex : search, $options : 'i' }
    }

    const shops = await DB.GamePrivateShopItem
    .aggregate([
      {
        $lookup: {
          from: "GamePrivateItem",
          localField: "item",
          foreignField: "_id",
          pipeline: [{
            $project: {
              item_id: 1, item_name: 1, item_image: 1
            },
          }],
          as: "item"
        }
      },
      { $unwind: { path: '$item' }},
      { $match: match },
      {
        $facet: {
          list: [
            { $sort: sorting },
            { $skip: (current - 1) * size },
            { $limit: size },
          ],
          pagination: [
            { $count: "total" }
          ]
        }
      }
    ])

    return resp(event, { result: { 
      list: shops[0].list ? shops[0].list : [],
      total: shops[0].pagination ? (shops[0].pagination[0] ? shops[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})