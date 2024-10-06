import type { IAuth, IDBGameChina } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { key } = await readBody(event)
    if(!key) throw 'Không tìm thấy khóa trò chơi'

    const game = await DB.GameChina.findOne({ key: key }).select('manager') as IDBGameChina
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const result = await DB.GameChina.aggregate([
      { $match: { _id: game._id } },
      {
        $lookup: {
          from: "GamePlatform",
          localField: "platform",
          foreignField: "_id",
          pipeline: [
            { $project: { name: 1, key: 1 }}
          ],
          as: "platform"
        }
      },
      { $unwind: { path: '$platform'} },
      {
        $lookup: {
          from: "GameCategory",
          localField: "category",
          foreignField: "_id",
          pipeline: [
            { $project: { name: 1, key: 1 }}
          ],
          as: "category"
        }
      },
      { $unwind: { path: '$category'} },
      {
        $lookup: {
          from: "GameChinaPayment",
          localField: "_id",
          foreignField: "game",
          pipeline: [
            { $match: { status: 1 } },
            { $project: { coin: 1 }}
          ],
          as: "payments"
        }
      },
      {
        $addFields: {
          coin: { $sum: '$payments.coin' }
        }
      },
      { $limit: 1 },
    ])

    if(result.length < 1) throw 'Trò chơi không tồn tại'
    return resp(event, { result: result[0] })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})