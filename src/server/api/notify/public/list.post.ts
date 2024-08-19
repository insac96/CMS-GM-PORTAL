import { Types } from 'mongoose'
import type { IAuth } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { page } = await readBody(event)
    if(!page) throw 'Thiếu dữ liệu phân trang'

    const { size, current, sort } = page
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.by || !sort.index) throw 'Dữ liệu sắp xếp sai'

    // Make Filter
    const filter : any = { user: auth._id }

    // Make Sort
    const sorting : any = {}
    sorting[sort.by] = Number(sort.index)
    
    // Get Notify
    const list = await DB.NotifyUser.aggregate([
      { $match : filter },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.NotifyUser.count(filter)

    // Result
    return resp(event, { result: { list, total }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})