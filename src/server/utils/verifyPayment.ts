import type { H3Event } from 'h3'
import type { Types } from 'mongoose'
import type { IDBGate, IDBUser } from '~~/types'

interface IBodyData {
  _id: Types.ObjectId,
  status: number,
  money: number,
  reason: string
}

export default async (
  event: H3Event, 
  { _id, status, money, reason } : IBodyData, 
  verifier? : Types.ObjectId,
  sendNotify : boolean = true
) : Promise<void> => {
  if(!_id) throw 'Không tìm thấy ID giao dịch'
  if(
    !!isNaN(parseInt(String(status))) 
    || parseInt(String(status)) < 1 
    || parseInt(String(status)) > 2
  ) throw 'Mã trạng thái không hợp lệ'
  if(
    !!isNaN(parseInt(String(money))) 
    || parseInt(String(money)) < 0 
  ) throw 'Số tiền không hợp lệ'
  if(status == 2 && !reason) throw 'Không tìm thấy lý do từ chối'

  // Set Real Value
  const realMoney = parseInt(String(money))
  const realStatus = realMoney == 0 ? 2 : status
  const realReason = reason || 'Giao dịch không hợp lệ'

  // Get Payment
  const payment = await DB.Payment
  .findOne({ _id: _id })
  .select('code gate user status')
  if(!payment) throw 'Giao dịch không tồn tại'
  if(payment.status > 0) throw 'Không thể thao tác trên giao dịch này'

  // Get Other
  const bot = await DB.User.findOne({'username': 'bot'}).select('_id') as IDBUser
  if(!bot) throw 'Không tìm thấy thông tin Bot'
  const user = await DB.User.findOne({ _id: payment.user }).select('_id') as IDBUser
  if(!user) throw 'Không tìm thấy thông tin tài khoản'
  const gate = await DB.Gate.findOne({ _id: payment.gate }).select('_id') as IDBGate
  if(!gate) throw 'Không tìm thấy thông tin kênh nạp'

  // Update Payment
  const time = new Date()
  const verify_person = !!verifier ? verifier : bot._id
  await DB.Payment.updateOne({ _id: _id }, {
    money: realMoney,
    status: realStatus,
    verify: {
      person: verify_person,
      time: time,
      reason: realReason
    }
  })

  // Check Status
  let realNotify
  if(realStatus == 1){
    // Update User
    await DB.User.updateOne({ _id: payment.user },{ $inc: { 'currency.coin': realMoney }})

    // Log User
    realNotify = `Bạn được duyệt thành công giao dịch <b>${payment.code}</b> với số tiền <b>${realMoney.toLocaleString('vi-VN')} VNĐ</b>`
    logAdmin(event, `Chấp nhận giao dịch nạp tiền <b>${payment.code}</b> với số tiền <b>${realMoney.toLocaleString('vi-VN')}</b>`, verify_person)
    logUser(event, user._id, `Nhận <b>${realMoney.toLocaleString('vi-VN')} Xu</b> từ giao dịch nạp tiền thành công <b>${payment.code}</b>`)
  }
  else {
    realNotify = `Bạn bị từ chối giao dịch <b>${payment.code}</b> với lý do <b>${realReason}</b>`
    logAdmin(event, `Từ chối giao dịch nạp tiền <b>${payment.code}</b> với lý do <b>${realReason}</b>`, verify_person)
  }

  // Send Notify
  if(!!sendNotify) await sendNotifyUser({
    user: payment.user,
    color: realStatus == 1 ? 'green' : 'red',
    content: realNotify
  })
}