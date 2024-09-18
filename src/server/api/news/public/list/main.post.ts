export default defineEventHandler(async (event) => {
  try {
    const { size, current, category, search } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!Array.isArray(category)) throw 'Dữ liệu thể loại không hợp lệ'

    const match:any = { display: true }
    if(category.length > 0){
      match['category'] = { $in: category }
    }
    if(!!search){
      const key = formatVNString(search, '-')
      match['key'] = { $regex : key, $options : 'i' }
    }

    const list = await DB.News
    .find(match)
    .select('title description key og_image')
    .sort({ pin: -1, createdAt: -1 })
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.News.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})