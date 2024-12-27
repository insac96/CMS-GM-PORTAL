import type { IAuth } from "~~/types"
import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { size, current, sort, search, category, platform } = await readBody(event)
    if(!size || !current || !search || !category || !platform) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!Array.isArray(platform)) throw 'Dữ liệu nền tảng không hợp lệ'
    if(!Array.isArray(category)) throw 'Dữ liệu thể loại không hợp lệ'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(search.key){
      const key = formatVNString(search.key, '-')
      match['$or'] = [
        { 'key': { $regex : key, $options : 'i' }},
        { 'code': { $regex : key, $options : 'i' }},
      ]
    }
    if(platform.length > 0){
      match['platform'] = { $in: platform.map((item: string) => new Types.ObjectId(item)) }
    }
    if(category.length > 0){
      match['category'] = { $in: category.map((item: string) => new Types.ObjectId(item)) }
    }

    const list = await DB.GameChina.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "GamePlatform",
          localField: "platform",
          foreignField: "_id",
          pipeline: [
            { $project: { name: 1 }}
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
            { $project: { name: 1 }}
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
        $lookup: {
          from: "User",
          localField: "manager",
          foreignField: "_id",
          pipeline: [
            { $project: { username: 1 }}
          ],
          as: "manager"
        }
      },
      {
        $addFields: {
          coin: { $sum: '$payments.coin' }
        }
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size },
    ])

    const total = await DB.GameChina.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})