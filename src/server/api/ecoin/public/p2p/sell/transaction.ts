import type { IAuth, IDBEcoinP2PSell, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, amount } = body
    if(!_id || !amount) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(amount) || parseInt(amount) < 1) throw 'Dữ liệu số lượng không hợp lệ'

    const booth = await DB.EcoinP2PSell.findOne({ _id: _id }) as IDBEcoinP2PSell
    if(!booth) throw 'Gian hàng không tồn tại'
    if(booth.user.toString() == auth._id.toString()) throw 'Bạn không thể tự bán trên gian hàng của mình'
    if(amount > booth.limit.end || amount < booth.limit.start) throw 'Số lượng ngoài vùng giới hạn'

    const seller = await DB.User.findOne({ _id: auth._id }).select('currency') as IDBUser
    if(!seller) throw 'Không tìm thấy thông tin người bán'
    if(seller.currency.ecoin < amount) throw 'Số dư ECoin của bạn không đủ'

    const buyer = await DB.User.findOne({ _id: booth.user }).select('currency') as IDBUser
    if(!buyer) throw 'Không tìm thấy thông tin người mua'
    
    const ecoinSell = parseInt(amount)
    const vndBuyerBuy = Math.round(ecoinSell * booth.vnd)
    if(!isNumber(vndBuyerBuy)) throw 'Dữ liệu VND không hỗ trợ'
    if(buyer.currency.vnd < vndBuyerBuy) throw 'Số dư VND của người mua không đủ'


    await DB.User.updateOne({ _id: seller._id }, { $inc: { 
      'currency.ecoin': ecoinSell * -1,
      'currency.vnd': vndBuyerBuy
    }})

    await DB.User.updateOne({ _id: buyer._id }, { $inc: { 
      'currency.ecoin': ecoinSell,
      'currency.vnd': vndBuyerBuy * -1
    }})

    const history = await DB.EcoinP2PSellHistory.create({
      buyer: buyer._id,
      seller: seller._id,
      booth: booth._id,
      ecoin: ecoinSell,
      vnd: vndBuyerBuy
    })

    sendNotifyUser({
      user: seller._id,
      content: `
        Bạn nhận được <b>${vndBuyerBuy.toLocaleString("vi-VN")}</b> VND 
        từ giao dịch P2P bán
        <b>${ecoinSell.toLocaleString("vi-VN")}</b> ECoin
      `
    })

    logUser({
      user: seller._id,
      action: `
        Bán <b>${ecoinSell.toLocaleString("vi-VN")}</b> ECoin 
        và nhận được <b>${vndBuyerBuy.toLocaleString("vi-VN")}</b> VND
      `,
      type: 'ecoin.p2p.sell'
    })

    sendNotifyUser({
      user: buyer._id,
      content: `
        Bạn nhận được <b>${ecoinSell.toLocaleString("vi-VN")}</b> ECoin 
        từ giao dịch P2P mua với giá
        <b>${vndBuyerBuy.toLocaleString("vi-VN")}</b> VND 
      `
    })

    logUser({
      user: buyer._id,
      action: `
        Mua <b>${ecoinSell.toLocaleString("vi-VN")}</b> ECoin 
        và bị trừ <b>${vndBuyerBuy.toLocaleString("vi-VN")}</b> VND
      `,
      type: 'ecoin.p2p.buy'
    })

    return resp(event, { message: 'Giao dịch thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})