import type { IDBGamePrivate } from "~~/types"
import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const { range, game : code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!range) throw 'Dữ liệu thời gian sai'

    const game = await DB.GamePrivate.findOne({ code: code }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const match : any = {}
    if(!!range && !!range['start'] && !!range['end']){
      const start : any = DayJS(range['start']).startOf('date')
      const end : any = DayJS(range['end']).endOf('date')
      match['time'] = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }
    }

    const list = await DB.GamePrivatePayment.aggregate([
      { $match: { game: new Types.ObjectId(game._id) } },
      {
        $project: {
          createdAt: 1, user: 1, coin: 1,
          timeformat: {
            $dateToString: { 
              format: '%Y-%m-%d', 
              date: '$createdAt', 
              timezone: 'Asia/Ho_Chi_Minh'
            }
          }
        }
      },
      {
        $group: {
          _id: {  timeformat: '$timeformat', user: '$user' },
          time: { $min: '$createdAt' },
          coin: { $sum: '$coin' },
        }
      },
      { $match: match },
      {
        $group: {
          _id: '$_id.user',
          value: { $sum: '$coin' },
        }
      },
      {
        $lookup: {
          from: "GamePrivateUser",
          localField: "_id",
          foreignField: "_id",
          pipeline: [{
            $project: { user: 1 }
          }],
          as: "userGame"
        }
      },
      { $unwind: { path: "$userGame" }},
      {
        $lookup: {
          from: "User",
          localField: "userGame.user",
          foreignField: "_id",
          pipeline: [{
            $project: { username: 1 }
          }],
          as: "user"
        }
      },
      { $unwind: { path: "$user" }},
      {
        $project: {
          username: '$user.username',
          value: 1
        }
      },
      { $limit: 10 }
    ])

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})