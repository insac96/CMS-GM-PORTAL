import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { category, title, description, collab : code } = body
    if(!category || !title || !description) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!code) throw 'Dữ liệu đầu vào không đủ'
        
    const collab = await DB.Collab.findOne({ code: code }).select('code user') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    const categoryCheck = await DB.NewsCategory.findOne({ _id: category }).select('_id name')
    if(!categoryCheck) throw 'Danh mục không tồn tại'

    const key = formatVNString(title, '-')
    const newsCheck = await DB.News.findOne({ key: key }).select('_id')
    if(!!newsCheck) throw 'Tiêu đề tin tức đã tồn tại'

    body.key = key
    body.creator = auth._id
    body.updater = auth._id
    body.collab = collab._id

    await DB.News.create(body)
    return resp(event, { message: 'Thêm tin tức thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})