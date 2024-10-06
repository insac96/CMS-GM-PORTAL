import type { IAuth, IDBGamePrivate } from "~~/types"

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

    const match : any = { 
      game: game._id, 
      display: true, 
      'gift.0': { $exists: true } 
    }
    if(search){
      match['$text'] = { '$search': search }
    }

    const shopPacks = await DB.GamePrivateShopPack
    .aggregate([
      { $match: match },
      {
        $lookup: {
          from: "GamePrivateItem",
          localField: "gift.item",
          foreignField: "_id",
          pipeline: [{
            $project: { item_name: 1, item_image: 1, item_id: 1 },
          }],
          as: "giftdata"
        }
      },
      {
        $addFields: {
          gift: {
            $map: {
              input: '$giftdata',
              in: {
                _id: '$$this._id',
                item_id: '$$this.item_id',
                item_name: '$$this.item_name',
                item_image: '$$this.item_image',
                amount: { 
                  $getField: {
                    field: 'amount',
                    input: {
                      $arrayElemAt: [ '$gift', { $indexOfArray: ['$gift.item', '$$this._id']} ]
                    }
                  }
                },
              }
            }
          }
        }
      },
      { $project: { giftdata: 0 } },
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
      list: shopPacks[0].list ? shopPacks[0].list : [],
      total: shopPacks[0].pagination ? (shopPacks[0].pagination[0] ? shopPacks[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})