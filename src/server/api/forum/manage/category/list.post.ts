import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { size, current, sort } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const list = await DB.ForumCategory
    .aggregate([
      {
        $lookup: {
          from: "ForumPost",
          localField: "_id",
          foreignField: "category",
          as: "postList",
          pipeline: [
            { $project: { _id: 1 }}
          ]
        }
      },
      {
        $lookup: {
          from: "ForumCategorySub",
          localField: "_id",
          foreignField: "category",
          as: "sub",
          pipeline: [
            { $project: { name: 1 }}
          ]
        }
      },
      { $addFields: { count: { $size: '$postList' }}},
      { $project: { postList: 0 }},
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.ForumCategory.count()
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})