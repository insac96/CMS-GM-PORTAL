import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 100) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, search } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { }
    if(!!search){
      match['code'] = { $regex : search, $options : 'i' }
    }

    const list = await DB.AdsFrom
    .aggregate([
      {
        $lookup: {
          from: "User",
          localField: "_id",
          foreignField: "reg.from",
          pipeline: [{
            $project: { _id: 1 }
          }],
          as: "users"
        }
      },
      {
        $lookup: {
          from: "Payment",
          localField: "users._id",
          foreignField: "user",
          as: "payments",
          pipeline: [{
            $match: { status: { $eq : 1 } }
          }]        
        }
      },
      { 
        $addFields: { 
          pay: { $sum: '$payments.money' }
        }
      },
      { $project: { users: 0, payments: 0 }},
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.AdsFrom.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})