export default defineEventHandler(async (event) => {
  try {
    const { key } = await readBody(event)
    if(!key) throw 'Không tìm thấy khóa trò chơi'

    const game = await DB.GameTool.aggregate([
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
          from: "GameToolUser",
          localField: "_id",
          foreignField: "game",
          pipeline: [
            { $project: { coin: 1 }}
          ],
          as: "users"
        }
      },
      {
        $addFields: {
          coin: { $sum: '$users.coin' }
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