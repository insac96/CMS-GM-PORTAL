import type { IAuth, IDBCollab } from "~~/types"
import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort, search, category, platform, isuse, collab : code } = await readBody(event)
    if(!size || !current || !search || !category || !platform) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!Array.isArray(platform)) throw 'Dữ liệu nền tảng không hợp lệ'
    if(!Array.isArray(category)) throw 'Dữ liệu thể loại không hợp lệ'
    if(!code) throw 'Dữ liệu đầu vào không đủ'
            
    const collab = await DB.Collab.findOne({ code: code }).select('code user') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { display: true }
    if(!!isuse){
      match['$expr'] = { '$in': [ collab._id, '$collab.use' ]}
    }
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
      { $addFields: {
        collab_use: { $cond : [{ $in: [ collab._id, '$collab.use' ]}, true, false] }
      }},
      { $project: { 
        code: 1, name: 1, platform: 1, category: 1, 
        'collab.commission': 1, 'collab_use': 1,
        'rate.pay': 1
      }},
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