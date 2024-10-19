import type { IAuth, IDBForumPost } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { content, post: postID } = body
    if(!postID) throw 'Không tìm thấy ID bài viết'
    if(!content) throw 'Vui lòng nhập đầy đủ thông tin'
    if(content.length < 30) throw 'Nội dung ít nhất 30 ký tự'

    const post = await DB.ForumPost.findOne({ _id: postID }).select('_id enable') as IDBForumPost
    if(!post) throw 'Bài viết không tồn tại'
    if(!post.enable.comment) throw 'Bài viết đã tắt tính năng bình luận'

    body.post = post._id
    body.user = auth._id
    await DB.ForumPostComment.create(body)
    await DB.ForumPost.updateOne({ _id: post._id }, {
      $inc: { 'statistic.comment': 1 },
      'update.comment' : Date.now(),
      'update.last' : Date.now(),
    })
    
    return resp(event, { message: 'Phản hồi thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})