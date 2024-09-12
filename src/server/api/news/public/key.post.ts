export default defineEventHandler(async (event) => {
  try {
    const { key } = await readBody(event)
    if(!key) throw 'Không tìm thấy khóa tin tức'

    const news = await DB.News
    .findOneAndUpdate({ key: key, display: true }, { $inc: { view: 1 } }, { new: true })
    .populate({ path: 'category', select: 'name color' })
    .populate({ path: 'updater', select: 'avatar username' })

    if(!news) throw 'Tin tức không tồn tại'
    return resp(event, { result: news })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})