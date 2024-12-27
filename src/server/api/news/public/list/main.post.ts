import type { IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, category, search } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!Array.isArray(category)) throw 'Dữ liệu thể loại không hợp lệ'

    const sorting : any = { pin: -1, collab: -1, createdAt: -1 }
    const match:any = { display: true }

    const collabCode = getCookie(event, 'collab')
    if(!!collabCode){
      const collab = await DB.Collab.findOne({ code: collabCode }).select('_id') as IDBCollab
      if(!!collab) match['$or'] = [
        { collab: collab._id },
        { collab: { $exists: false } }
      ]
      else match['collab'] = { $exists: false }
    }
    else {
      match['collab'] = { $exists: false }
    }

    if(category.length > 0){
      match['category'] = { $in: category }
    }
    if(!!search){
      const key = formatVNString(search, '-')
      match['key'] = { $regex : key, $options : 'i' }
    }

    const list = await DB.News
    .find(match)
    .select('title description key og_image createdAt')
    .populate({ path: 'category', select: 'name color' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.News.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})