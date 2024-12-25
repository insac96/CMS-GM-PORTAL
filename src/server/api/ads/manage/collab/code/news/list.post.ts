import type { IAuth, IDBAdsCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort, collab : code } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!code) throw 'Dữ liệu đầu vào không đủ'
    
    const adsCollab = await DB.AdsCollab.findOne({ code: code }).select('code user') as IDBAdsCollab
    if(!adsCollab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && adsCollab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const list = await DB.News
    .find({ collab: adsCollab._id })
    .select('-content')
    .populate({ path: 'category', select: 'name color' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.News.count()
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})