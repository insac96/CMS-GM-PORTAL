import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, search } = await readBody(event)
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(search.key){
      const key = formatVNString(search.key, '-')
      match['key'] = { $regex : key, $options : 'i' }
    }

    const list = await DB.GameChina
    .find(match)
    .select('-content -createdAt')
    .populate({ path: 'platform', select: 'name' })
    .populate({ path: 'category', select: 'name' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GameChina.count()
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})