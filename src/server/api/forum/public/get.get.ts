export default defineEventHandler(async (event) => {
  try {
    const posts = await DB.ForumPost
    .find({ block: false, close: false })
    .populate({ path: 'category', select: 'name key icon color' })
    .populate({ path: 'sub', select: 'name key' })
    .populate({ path: 'creater', select: 'username avatar type level vip online', populate: { path: 'level' } })
    .select('category sub creater title key statistic update.last close block pin')
    .sort({ pin: -1, 'update.last': -1 })
    .limit(5)
    .skip(0)

    const categories = await DB.ForumCategory
    .aggregate([
      {
        $lookup: {
          from: "ForumPost",
          localField: "_id",
          foreignField: "category",
          as: "postList",
          pipeline: [
            { $project: { _id: 1, statistic: 1 }}
          ]
        }
      },
      {
        $lookup: {
          from: "ForumCategorySub",
          localField: "_id",
          foreignField: "category",
          as: "subs",
          pipeline: [
            { $project: { name: 1, key: 1 }}
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

    return resp(event, { result: { posts, categories } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})