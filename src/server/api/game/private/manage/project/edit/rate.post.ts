import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id, payment, shop } = await readBody(event)
    if(!_id || !payment || !shop) throw 'Dữ liệu đầu vào không đủ'
    if(!payment.limit) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(payment.default)) || parseInt(payment.default) < 0) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(payment.limit.number)) || parseInt(payment.limit.number) < 0) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!shop.limit) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(shop.default)) || parseInt(shop.default) < 0) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(shop.limit.number)) || parseInt(shop.limit.number) < 0) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: _id }).select('name')
    if(!game) throw 'Trò chơi không tồn tại'

    await DB.GamePrivate.updateOne({ _id: _id },{ 
      rate: {
        payment: payment,
        shop: shop
      }
    })

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})