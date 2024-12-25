import type { IAuth, IDBAdsCollab, IDBNews } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { _id, content, collab : code } = await readBody(event)
    if(!_id || !content) throw 'Dữ liệu đầu vào không đủ'
    if(!code) throw 'Dữ liệu đầu vào không đủ'
                
    const adsCollab = await DB.AdsCollab.findOne({ code: code }).select('code user') as IDBAdsCollab
    if(!adsCollab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && adsCollab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    const news = await DB.News.findOne({ _id: _id }).select('title') as IDBNews
    if(!news) throw 'Tin tức không tồn tại'
    if(news.collab.toString() != adsCollab._id.toString()) throw 'Tin tức không thuộc cộng tác viên này'

    await DB.News.updateOne({ _id: _id },{ 
      content: content, 
      updater: auth._id 
    })

    return resp(event, { message: 'Cập nhật nội dung thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})