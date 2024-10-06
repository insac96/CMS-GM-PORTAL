import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id : gameID, payment, shop } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!payment || !shop) throw 'Dữ liệu đầu vào không đủ'
    if(!payment.limit) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(payment.default)) || parseInt(payment.default) < 0) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(payment.limit.number)) || parseInt(payment.limit.number) < 0) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!shop.limit) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(shop.default)) || parseInt(shop.default) < 0) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(shop.limit.number)) || parseInt(shop.limit.number) < 0) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('name manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    await DB.GamePrivate.updateOne({ _id: game._id },{ 
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