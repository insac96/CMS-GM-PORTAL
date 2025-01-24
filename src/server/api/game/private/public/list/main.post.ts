import type { IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, search, category, platform, skip } = await readBody(event)
    if(!size || !current || !category || !platform) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!Array.isArray(platform)) throw 'Dữ liệu nền tảng không hợp lệ'
    if(!Array.isArray(category)) throw 'Dữ liệu thể loại không hợp lệ'

    const sorting : any = { pin: -1, createdAt: -1 }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { display: true }

    const collabCode = getCookie(event, 'collab')
    if(!!collabCode){
      const collab = await DB.Collab.findOne({ code: collabCode }).select('_id') as IDBCollab
      if(!!collab) match['$expr'] = { '$in': [ collab._id, '$collab.use' ]}
    }
    
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
    if(skip){
      match['_id'] = { $ne: skip }
    }

    const list = await DB.GamePrivate
    .find(match)
    .select('name code key pin statistic description image.banner image.icon rate hasecoin')
    .populate({ path: 'platform', select: 'name key' })
    .populate({ path: 'category', select: 'name key' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GamePrivate.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})