import type { IAuth, IDBForumCategory } from "~~/types"
import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { category : categoryID, size, current, sort } = await readBody(event)
    if(!categoryID) throw 'Không tìm thấy ID danh mục mẹ'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const category = await DB.ForumCategory.findOne({ _id: categoryID }).select('_id') as IDBForumCategory
    if(!category) throw 'Danh mục mẹ không tồn tại'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { category: new Types.ObjectId(category._id) }
    const list = await DB.ForumCategorySub
    .aggregate([
      { $match: match },
      {
        $lookup: {
          from: "ForumPost",
          localField: "_id",
          foreignField: "sub",
          as: "postList",
          pipeline: [
            { $project: { _id: 1 }}
          ]
        }
      },
      { $addFields: { count: { $size: '$postList' }}},
      { $project: { postList: 0 }},
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.ForumCategorySub.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})