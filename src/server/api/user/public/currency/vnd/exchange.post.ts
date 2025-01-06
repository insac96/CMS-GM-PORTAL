import type { IAuth, IDBEcoinP2PBuy, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { amount } = body
    if(!isNumber(amount) || parseInt(amount) < 1) throw 'Dữ liệu Xu không hợp lệ'

    const coin = parseInt(amount)
    const vnd = Math.floor((coin * 90) / 100)

    const user = await DB.User.findOne({ _id: auth._id }).select('currency') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin người dùng'
    if(user.currency.coin < coin) throw 'Số dư xu không đủ'

    await DB.User.updateOne({ _id: user._id }, { $inc: { 
      'currency.coin': coin * -1,
      'currency.vnd': vnd
    }})

    sendNotifyUser({
      user: user._id,
      content: `
        Bạn đã chuyển <b>${coin.toLocaleString("vi-VN")}</b> Xu 
        thành <b>${vnd.toLocaleString("vi-VN")}</b> VND
      `
    })

    logUser({
      user: user._id,
      action: `
        Chuyển <b>${coin.toLocaleString("vi-VN")}</b> Xu 
        thành <b>${vnd.toLocaleString("vi-VN")}</b> VND
      `,
      type: 'user.currency.vnd.exchange'
    })

    return resp(event, { message: 'Giao dịch thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})