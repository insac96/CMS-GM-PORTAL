import type { IAuth, IDBGamePrivate } from "~~/types"
import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, game: gameCode } = await readBody(event)
    if(!gameCode) throw 'Không tìm thấy mã trò chơi'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const game = await DB.GamePrivate.findOne({ code: gameCode, display: true }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { 
      game: new Types.ObjectId(game._id),
      display: true,
      public: true
    }

    const list = await DB.GamePrivateGiftcode
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
      { $project: { giftdata: 0 }},
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.GamePrivateGiftcode.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})