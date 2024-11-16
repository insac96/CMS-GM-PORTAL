export default defineEventHandler(async (event) => {
  try {
    const { size, current } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'

    const sorting : any = { 'createdAt': -1 }
    const match : any = { display: true }
    const list = await DB.News
    .find(match)
    .select('title key view category createdAt')
    .populate({ path: 'category', select: 'name key' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * 6)

    const total = await DB.News.count(match)

    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})