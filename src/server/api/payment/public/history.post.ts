import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort, search, user, range } = await readBody(event)
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const userCheck = (!!user && auth.type == 100) ? user : auth._id
    
    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { user: userCheck }
    if(search.key && search.by){
      match['code'] = { $regex : search.key.toLowerCase(), $options : 'i' }
    }
    if(!!range && !!range['start'] && !!range['end']){
      match['createdAt'] = { $gte: new Date(range['start']), $lte: new Date(range['end']) }
    }

    const list = await DB.Payment
    .find(match)
    .select('gate code money status createdAt')
    .populate({
      path: 'gate', select: 'name'
    })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.Payment.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})