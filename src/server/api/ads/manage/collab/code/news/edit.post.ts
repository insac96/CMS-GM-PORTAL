import type { IAuth, IDBAdsCollab, IDBNews, IDBNewsCategory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { _id, category, title, description, collab : code } = body
    if(!_id || !category || !title || !description) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!code) throw 'Dữ liệu đầu vào không đủ'
            
    const adsCollab = await DB.AdsCollab.findOne({ code: code }).select('code user') as IDBAdsCollab
    if(!adsCollab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && adsCollab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    const categoryCheck = await DB.NewsCategory.findOne({ _id: category }).select('_id name') as IDBNewsCategory
    if(!categoryCheck) throw 'Danh mục không tồn tại'

    const newsCheck = await DB.News.findOne({ _id: _id }).select('collab') as IDBNews
    if(!newsCheck) throw 'Tin tức không tồn tại'
    if(newsCheck.collab.toString() != adsCollab._id.toString()) throw 'Tin tức không thuộc cộng tác viên này'

    if(newsCheck.title != title){
      const key = formatVNString(title, '-')
      const getByKey = await DB.News.findOne({ key: key }).select('_id')
      if(!!getByKey) throw 'Tiêu đề tin tức đã tồn tại'
      body.key = key
    }

    delete body['_id']
    delete body['collab']
    body.updater = auth._id

    await DB.News.updateOne({ _id: _id }, body)
    return resp(event, { message: 'Sửa tin tức thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})