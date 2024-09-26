export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, search, category, platform, os } = await readBody(event)
    if(!size || !current || !category || !platform || !os) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!Array.isArray(platform)) throw 'Dữ liệu nền tảng không hợp lệ'
    if(!Array.isArray(category)) throw 'Dữ liệu thể loại không hợp lệ'

    const gameDB = {
      'tool': DB.GameTool,
      //'private': DB.GamePrivate,
      'china': DB.GameChina
    }
    // @ts-expect-error
    if(!gameDB[os]) throw 'Dữ liệu hệ điều hành sai'

    const sorting : any = { pin: -1 }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { display: true }
    if(!!search){
      const key = formatVNString(search, '-')
      match['$or'] = [
        { 'key': { $regex : key, $options : 'i' }},
        { 'code': { $regex : key, $options : 'i' }},
      ]
    }
    if(platform.length > 0){
      match['platform'] = { $in: platform }
    }
    if(category.length > 0){
      match['category'] = { $in: category }
    }

    // @ts-expect-error
    const list = await gameDB[os]
    .find(match)
    .select('_id name code key pin statistic description image.banner image.icon')
    .populate({ path: 'platform', select: 'name' })
    .populate({ path: 'category', select: 'name' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    // @ts-expect-error
    const total = await gameDB[os].count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})