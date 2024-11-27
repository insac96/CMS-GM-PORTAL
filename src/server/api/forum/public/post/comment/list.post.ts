import type { IDBForumPost } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { post: postID, size, current, sort } = await readBody(event)
    if(!postID) throw 'Không tìm thấy ID bài viết'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const post = await DB.ForumPost.findOne({ _id: postID }).select('_id') as IDBForumPost
    if(!post) throw 'Bài viết không tồn tại'

    const match : any = { post: post._id }
    const sorting : any = { pin: -1, createdAt: -1 }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const list = await DB.ForumPostComment
    .find(match)
    .populate({ path: 'user', select: 'username avatar type level vip online', populate: { path: 'level' } })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.ForumPostComment.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    const list : any = []
    const total = 0
    return resp(event, { result: { list, total } })
  }
})