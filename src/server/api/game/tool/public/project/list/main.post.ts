export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, search, category, platform } = await readBody(event)
    if(!size || !current || !category || !platform) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!Array.isArray(platform)) throw 'Dữ liệu nền tảng không hợp lệ'
    if(!Array.isArray(category)) throw 'Dữ liệu thể loại không hợp lệ'

    const sorting : any = { pin: -1 }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { display: true }
    if(!!search){
      const key = formatVNString(search, '-')
      match['key'] = { $regex : key, $options : 'i' }
    }
    if(platform.length > 0){
      match['platform'] = { $in: platform }
    }
    if(category.length > 0){
      match['category'] = { $in: category }
    }

    const list = await DB.GameTool
    .find(match)
    .select('name code key pin statistic description image.banner image.icon')
    .populate({ path: 'platform', select: 'name' })
    .populate({ path: 'category', select: 'name' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GameTool.count()
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})