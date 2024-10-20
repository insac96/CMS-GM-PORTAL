import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id, name, color, description, icon } = body
    if(!_id || !name || !color || !description) throw 'Dữ liệu đầu vào không hợp lệ'

    const category = await DB.ForumCategory.findOne({ _id: _id }).select('name')
    if(!category) throw 'Danh mục không tồn tại'
    if(category.name != name){
      const key = formatVNString(name, '-')
      const getByKey = await DB.ForumCategory.findOne({ key: key }).select('_id')
      if(!!getByKey) throw 'Tên danh mục đã tồn tại'
      body.key = key
    }

    delete body['_id']
    body.icon = icon || 'i-bxs-folder-open'
    await DB.ForumCategory.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin danh mục diễn đàn <b>${category.name}</b>`)

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})