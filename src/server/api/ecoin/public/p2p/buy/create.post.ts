import type { IAuth, IDBUser } from "~~/types"

// Đăng bán
export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { limit } = body
    if(!limit) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(limit.start) || parseInt(limit.start) < 1) throw 'Dữ liệu giới hạn bắt đầu không hợp lệ'
    if(!isNumber(limit.end) || parseInt(limit.end) < 1) throw 'Dữ liệu giới hạn kết thúc không hợp lệ'
    if(limit.end <= limit.start) throw 'Giới hạn kết thúc không thể nhỏ hoặc bằng giới hạn bắt đầu'

    const user = await DB.User.findOne({ _id: auth._id }).select('currency') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    const season = await getEcoinSeason(event)

    const count = await DB.EcoinP2PBuy.count({ user: auth._id })
    if(count > 0) throw 'Bạn đang có 1 gian hàng đăng bán hoạt động'

    if(limit.start >= user.currency.ecoin) throw "Tài khoản của bạn không đủ số lượng ECoin để đặt giới hạn ban đầu"
    if(limit.end >= user.currency.ecoin) throw "Tài khoản của bạn không đủ số lượng ECoin để đặt giới hạn kết thúc"

    await DB.EcoinP2PBuy.create({ user: user._id, ...body })
    await DB.User.updateOne({ _id: user._id }, { $inc: { 'currency.ecoin': limit.end * -1 }})

    return resp(event, { message: 'Đăng tin thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})