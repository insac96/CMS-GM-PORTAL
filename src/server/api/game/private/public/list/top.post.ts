import type { IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { display: true }
    const collabCode = getCookie(event, 'collab')
    if(!!collabCode){
      const collab = await DB.Collab.findOne({ code: collabCode }).select('_id') as IDBCollab
      if(!!collab) match['$expr'] = { '$in': [ collab._id, '$collab.use' ]}
    }
    
    const list = await DB.GamePrivate
    .find(match)
    .select('name code key pin statistic description image.banner image.icon')
    .populate({ path: 'platform', select: 'name key' })
    .populate({ path: 'category', select: 'name key' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})