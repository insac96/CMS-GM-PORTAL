import { IDBForumCategory, IDBForumCategorySub } from "~~/types"
import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const { key, sub: subKey } = await readBody(event)
    if(!key) throw 'Không tìm thấy khóa danh mục'

    const result : any = {
      category: null,
      subcategory: null,
      subs: null
    }

    const category = await DB.ForumCategory.findOne({ key: key }) as IDBForumCategory
    if(!category) throw 'Danh mục không tồn tại'
    result.category = category

    if(!!subKey){
      const subcategory = await DB.ForumCategorySub.findOne({ category: category._id, key: subKey }) as IDBForumCategorySub
      if(!!subcategory) result.subcategory = subcategory
    }

    if(!result.subcategory){
      const subs = await DB.ForumCategorySub.aggregate([
        { $match: { category: new Types.ObjectId(category._id) }},
        {
          $lookup: {
            from: "ForumPost",
            localField: "_id",
            foreignField: "sub",
            as: "postList",
            pipeline: [
              { $project: { _id: 1, statistic: 1 }}
            ]
          }
        },
        { $addFields: { 
          posts: { $size: '$postList' },
          views: { $sum: '$postList.statistic.view' },
          comments: { $sum: '$postList.statistic.comment' },
        }},
        { $project: { postList: 0 }},
      ])
      result.subs = subs.length > 0 ? subs : null
    }
    
    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})