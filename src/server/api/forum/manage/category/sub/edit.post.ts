import type { IAuth, IDBForumCategory, IDBForumCategorySub } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id, category : categoryID, name, description } = body
    if(!categoryID) throw 'Không tìm thấy ID danh mục mẹ'
    if(!_id || !name || !description) throw 'Dữ liệu đầu vào không hợp lệ'

    const category = await DB.ForumCategory.findOne({ _id: categoryID }).select('name') as IDBForumCategory
    if(!category) throw 'Danh mục mẹ không tồn tại'

    const subcategory = await DB.ForumCategorySub.findOne({ category: category._id, _id: _id }).select('name') as IDBForumCategorySub
    if(!subcategory) throw 'Danh mục con không tồn tại'

    if(subcategory.name != name){
      const key = formatVNString(name, '-')
      const getByKey = await DB.ForumCategorySub.findOne({ category: category._id, key: key }).select('_id') as IDBForumCategorySub
      if(!!getByKey) throw 'Tên danh mục con đã tồn tại'
      body.key = key
    }

    delete body['_id']
    delete body['category']
    await DB.ForumCategory.updateOne({ _id: subcategory._id }, body)

    logAdmin(event, `Sửa thông tin danh mục con <b>${subcategory.name}</b> của danh mục <b>${category.name}</b> diễn đàn`)

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})