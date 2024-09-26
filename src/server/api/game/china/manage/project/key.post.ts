export default defineEventHandler(async (event) => {
  try {
    const { key } = await readBody(event)
    if(!key) throw 'Không tìm thấy khóa trò chơi'

    const game = await DB.GameChina.aggregate([
      { $match: { key: key } },
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

    if(game.length < 1) throw 'Trò chơi không tồn tại'
    return resp(event, { result: game[0] })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})