export default defineEventHandler(async (event) => {
  try {
    const { category: categoryID, sub: subID, size, current, sort, search } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const match : any = { block: false }
    if(!!categoryID){
      match['category'] = categoryID
    }
    if(!!subID){
      match['sub'] = subID
    }
    if(!!search){
      const key = formatVNString(search, '-')
      match['$or'] = [
        { 'name': { $regex : key, $options : 'i' }},
        { 'key': { $regex : key, $options : 'i' }},
      ]
    }

    const sorting : any = { pin: -1 }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1
    
    const list = await DB.ForumPost
    .find(match)
    .populate({ path: 'category', select: 'name key icon color' })
    .populate({ path: 'sub', select: 'name key' })
    .populate({ path: 'creater', select: 'username avatar type level vip online', populate: { path: 'level' } })
    .select('category sub creater title key statistic update.last close block pin')
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.ForumPost.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})