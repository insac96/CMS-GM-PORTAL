import type { IAuth, IDBForumPost, IDBForumPostLike } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { post: postID } = body
    if(!postID) throw 'Không tìm thấy ID bài viết'

    const post = await DB.ForumPost.findOne({ _id: postID }).select('title') as IDBForumPost
    if(!post) throw 'Bài viết không tồn tại'

    const liked = await DB.ForumPostLike.findOne({ user: auth._id, post: post._id }).select('_id') as IDBForumPostLike
    if(!!liked) throw 'Bạn đã thích bài viết này rồi'

    await DB.ForumPostLike.create({ user: auth._id, post: post._id })
    await DB.ForumPost.updateOne({ _id: post._id }, {
      $inc: { 'statistic.like': 1 },
      'update.like' : Date.now()
    })

    logUser({
      user: auth._id,
      action: `Thích bài viết <b>${post.title}</b> trong diễn đàn`,
      type: 'forum.like',
      target: post._id.toString()
    })
    
    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})