import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const list = await DB.EcoinP2PSell
    .find({})
    .populate({ path: 'user', select: 'currency username avatar type level role.use vip online', populate: { path: 'level' } })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.EcoinP2PSell.count()
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})