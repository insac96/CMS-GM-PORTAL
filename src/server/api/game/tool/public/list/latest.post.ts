export default defineEventHandler(async (event) => {
  try {
    const { size, current } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'

    const sorting : any = { 'createdAt': -1 }
    const match : any = { display: true }
    const list = await DB.GameTool
    .find(match)
    .select('name code key pin statistic description image.banner image.icon')
    .populate({ path: 'platform', select: 'name key' })
    .populate({ path: 'category', select: 'name key' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * 6)

    const total = await DB.GameTool.count(match)

    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})