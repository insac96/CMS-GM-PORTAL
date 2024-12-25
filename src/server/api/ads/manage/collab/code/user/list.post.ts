import type { IAuth, IDBAdsCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort, search, collab : code } = await readBody(event)
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!code) throw 'Dữ liệu đầu vào không đủ'
        
    const adsCollab = await DB.AdsCollab.findOne({ code: code }).select('code user') as IDBAdsCollab
    if(!adsCollab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && adsCollab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { 'reg.collab': adsCollab._id }
    if(!!search.key){
      if(search.by == 'USER') match['username'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      if(search.by == 'MAIL') match['email'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      if(search.by == 'PHONE') match['phone'] = { $regex : search.key, $options : 'i' }
    }

    const list = await DB.User
    .aggregate([
      { $match: match },
      { 
        $project: {
          username: 1, 
          email: 1,
          phone: 1,
          level: 1,
          coin: '$currency.coin',
          exp: '$currency.exp',
          type: 1,
          block: 1,
          createdAt: 1
        }
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.User.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})