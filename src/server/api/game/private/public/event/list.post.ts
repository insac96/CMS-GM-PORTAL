import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { type, game: code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!type) throw 'Kiểu sự kiện không hỗ trợ'

    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const list = await DB.GamePrivateEvent
    .aggregate([
      { $match: { type: type, game: game._id, display: true } },
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
      { $sort: { need: 1 } },
    ])

    for (let i = 0; i < list.length; i++) {
      list[i].status = await getGamePrivateEventActive(event, list[i], type)
    }

    return resp(event, { result: { list: list } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})