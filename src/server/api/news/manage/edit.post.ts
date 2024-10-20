import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id, category, title, description } = body
    if(!_id || !category || !title || !description) throw 'Dữ liệu đầu vào không hợp lệ'

    const categoryCheck = await DB.NewsCategory.findOne({ _id: category }).select('_id name')
    if(!categoryCheck) throw 'Danh mục không tồn tại'

    const newsCheck = await DB.News.findOne({ _id: _id }).select('title')
    if(!newsCheck) throw 'Tin tức không tồn tại'

    if(newsCheck.title != title){
      const key = formatVNString(title, '-')
      const getByKey = await DB.News.findOne({ key: key }).select('_id')
      if(!!getByKey) throw 'Tiêu đề tin tức đã tồn tại'
      body.key = key
    }

    delete body['_id']
    body.updater = auth._id

    await DB.News.updateOne({ _id: _id }, body)
    logAdmin(event, `Sửa thông tin tin tức <b>${newsCheck.title}</b>`)

    return resp(event, { message: 'Sửa tin tức thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})