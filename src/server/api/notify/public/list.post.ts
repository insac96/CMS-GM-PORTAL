import { Types } from 'mongoose'
import type { IAuth } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const match : any = { user: auth._id }
    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1
    
    // Get Notify
    const list = await DB.NotifyUser
    .find(match)
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    await DB.NotifyUser.updateMany({ _id: { $in: list.map(i => i._id) } }, { watched: true })

    const total = await DB.NotifyUser.count(match)
    return resp(event, { result: { list, total }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})