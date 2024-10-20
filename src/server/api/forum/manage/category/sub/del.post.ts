import type { IAuth, IDBForumCategory, IDBForumCategorySub } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { category : categoryID, _id } = await readBody(event)
    if(!categoryID) throw 'Không tìm thấy ID danh mục mẹ'
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const category = await DB.ForumCategory.findOne({ _id: categoryID }).select('_id name') as IDBForumCategory
    if(!category) throw 'Danh mục mẹ không tồn tại'

    const subcategory = await DB.ForumCategorySub.findOne({ category: category._id, _id: _id }).select('name') as IDBForumCategorySub
    if(!subcategory) throw 'Danh mục con không tồn tại'
    
    const posts = await DB.ForumPost.count({ sub: subcategory._id })
    if(posts > 0) throw 'Không thể xóa danh mục đã có bài viết'

    await DB.ForumCategorySub.deleteOne({ _id: subcategory._id })
    logAdmin(event, `Xóa danh mục con <b>${subcategory.name}</b> của danh mục <b>${category.name}</b> diễn đàn `)

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})