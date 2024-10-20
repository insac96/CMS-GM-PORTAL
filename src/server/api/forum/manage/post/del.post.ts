import type { IAuth, IDBForumPost } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const post = await DB.ForumPost.findOne({ _id: _id }).select('title') as IDBForumPost
    if(!post) throw 'Bài viết không tồn tại'
    
    await DB.ForumPostComment.deleteMany({ post: post._id })
    await DB.ForumPostLike.deleteMany({ post: post._id })
    await DB.ForumPost.deleteOne({ _id: post._id })

    logAdmin(event, `Xóa bài viết diễn đàn <b>${post.title}</b>`)

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})