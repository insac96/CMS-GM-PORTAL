import { IAuth, IDBForumPost, IDBForumPostLike } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { key } = await readBody(event)
    if(!key) throw 'Không tìm thấy khóa bài viết'

    const post = await DB.ForumPost
    .findOneAndUpdate(
      { key: key, block: false },
      { $inc: { 'statistic.view': 1 } }, 
      { new: true }
    )
    .populate({ path: 'category', select: 'name key icon color' })
    .populate({ path: 'sub', select: 'name key' })
    .populate({ path: 'creater', select: 'username avatar type level vip online', populate: { path: 'level' } }) as IDBForumPost
    if(!post) throw 'Bài viết không tồn tại'

    const result = JSON.parse(JSON.stringify(post))
    const auth = await getAuth(event, false)
    if(!!auth){
      const liked = await DB.ForumPostLike.findOne({ user: (auth as IAuth)._id, post: post._id }).select('_id') as IDBForumPostLike
      if(!!liked) result.liked = true
    }
    
    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})