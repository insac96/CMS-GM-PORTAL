import type { IAuth } from "~~/types"

// Đăng mua
export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { vnd, limit } = body
    if(!limit) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(vnd) || parseInt(vnd) < 1) throw 'Dữ liệu giá không hợp lệ'
    if(!isNumber(limit.start) || parseInt(limit.start) < 1) throw 'Dữ liệu giới hạn bắt đầu không hợp lệ'
    if(!isNumber(limit.end) || parseInt(limit.end) < 1) throw 'Dữ liệu giới hạn kết thúc không hợp lệ'
    if(limit.end <= limit.start) throw 'Giới hạn kết thúc không thể nhỏ hoặc bằng giới hạn bắt đầu'

    const count = await DB.EcoinP2PSell.count({ user: auth._id })
    if(count > 0) throw 'Bạn đang có 1 gian hàng đăng mua hoạt động'

    await DB.EcoinP2PSell.create({
      user: auth._id,
      ...body
    })

    return resp(event, { message: 'Đăng tin thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})