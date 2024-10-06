import type { IAuth, IDBGamePrivate } from "~~/types"
import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const match : any = { game: new Types.ObjectId(game._id) }

    const list = await DB.GamePrivateItemBox
    .aggregate([
      { $match : match },
      {
        $lookup: {
          from: "GamePrivateItem",
          localField: "gift.item",
          foreignField: "_id",
          pipeline: [{
            $project: { item_id: 1, item_name: 1, item_image: 1 },
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
      { $project: { giftdata: 0, createdAt: 0, updatedAt: 0 }}
    ])

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})