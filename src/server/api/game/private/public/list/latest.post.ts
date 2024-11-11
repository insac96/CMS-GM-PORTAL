export default defineEventHandler(async (event) => {
  try {
    const { current } = await readBody(event)
    if(!current) throw 'Dữ liệu phân trang sai'

    const sorting : any = { 'createdAt': -1 }
    const match : any = { display: true }
    const list = await DB.GamePrivate
    .find(match)
    .select('name code key pin statistic description image.banner image.icon rate')
    .populate({ path: 'platform', select: 'name key' })
    .populate({ path: 'category', select: 'name key' })
    .sort(sorting)
    .limit(6)
    .skip((current - 1) * 6)

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})