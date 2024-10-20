import type { IAuth, IDBForumCategory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { category : categoryID, name, description } = body
    if(!categoryID) throw 'Không tìm thấy ID danh mục mẹ'
    if(!name || !description) throw 'Dữ liệu đầu vào không hợp lệ'

    const category = await DB.ForumCategory.findOne({ _id: categoryID }).select('_id name') as IDBForumCategory
    if(!category) throw 'Danh mục mẹ không tồn tại'

    const key = formatVNString(name, '-')
    const getByKey = await DB.ForumCategorySub.findOne({ category: category._id, key: key }).select('_id')
    if(!!getByKey) throw 'Tên danh mục đã tồn tại'

    body.key = key
    body.category = category._id
    await DB.ForumCategorySub.create(body)
    logAdmin(event, `Thêm danh mục con <b>${name}</b> vào danh mục <b>${category.name}</b> diễn đàn`)
    
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})