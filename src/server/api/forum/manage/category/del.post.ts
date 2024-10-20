import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const category = await DB.ForumCategory.findOne({ _id: _id }).select('name')
    if(!category) throw 'Danh mục không tồn tại'
    
    const posts = await DB.ForumPost.count({ category: _id })
    if(posts > 0) throw 'Không thể xóa danh mục đã có bài viết'

    await DB.ForumCategory.deleteOne({ _id: _id })
    await DB.ForumCategorySub.deleteMany({ category: _id })
    logAdmin(event, `Xóa danh mục diễn đàn <b>${category.name}</b>`)

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})