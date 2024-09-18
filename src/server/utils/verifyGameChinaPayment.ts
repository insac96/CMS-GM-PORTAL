import type { H3Event } from 'h3'
import type { Types } from 'mongoose'
import type { IDBGameChina, IDBGameChinaPayment, IDBUser } from '~~/types'

interface IBodyData {
  _id: Types.ObjectId,
  status: number,
  reason?: string
}

export default async (
  event: H3Event, 
  { _id, status, reason } : IBodyData, 
  game: IDBGameChina,
  verifier? : Types.ObjectId,
  sendNotify : boolean = true
) : Promise<void> => {
  if(!_id) throw 'Không tìm thấy ID giao dịch'
  if(
    !!isNaN(parseInt(String(status))) 
    || parseInt(String(status)) < 1 
    || parseInt(String(status)) > 3
  ) throw 'Mã trạng thái không hợp lệ'
  if((status == 2 || status == 3) && !reason) throw 'Không tìm thấy lý do từ chối'

  // Get Payment
  const payment = await DB.GameChinaPayment.findOne({ _id: _id }) as IDBGameChinaPayment
  if(!payment) throw 'Giao dịch không tồn tại'
  if(payment.status > 0) throw 'Không thể thao tác trên giao dịch này'

  // Get Other
  const bot = await DB.User.findOne({'username': 'bot'}).select('_id') as IDBUser
  if(!bot) throw 'Không tìm thấy thông tin Bot'
  const user = await DB.User.findOne({ _id: payment.user }).select('_id') as IDBUser
  if(!user) throw 'Không tìm thấy thông tin tài khoản'

  // Update Payment
  const time = new Date()
  const verify_person = !!verifier ? verifier : bot._id
  await DB.GameChinaPayment.updateOne({ _id: _id }, {
    status: status,
    verify: {
      person: verify_person,
      time: time,
      reason: reason
    }
  })

  // Check Status
  let realNotify : any
  if(status == 1){
    realNotify = `
      Bạn được duyệt thành công giao dịch nạp
      <b>[Game China] ${game.name}</b>, mã giao dịch <b>${payment.code}</b>
    `
  }
  if(status == 2){
    await DB.User.updateOne({ _id: user._id }, {
      $inc: { 'currency.coin': payment.coin }
    })
    
    realNotify = `
      Bạn bị từ chối giao dịch nạp 
      <b>[Game China] ${game.name}</b>, mã giao dịch <b>${payment.code}</b> 
      với lý do <b>${reason}</b> 
      và được hoàn lại <b>${payment.coin.toLocaleString('vi-VN')}</b> Xu 
    `

    logUser(event, user._id, `
      Nhận <b>${payment.coin.toLocaleString('vi-VN')}</b> Xu 
      từ lệnh từ chối giao dịch nạp 
      <b>[Game China] ${game.name}</b>, mã giao dịch <b>${payment.code}</b>
    `)
  }
  if(status == 3){
    await DB.User.updateOne({ _id: user._id }, {
      $inc: { 'currency.coin': payment.coin }
    })

    realNotify = `
      Nhận <b>${payment.coin.toLocaleString('vi-VN')}</b> Xu 
      từ lệnh hoàn tác giao dịch nạp 
      <b>[Game China] ${game.name}</b>, mã giao dịch <b>${payment.code}</b>
    `
    logUser(event, user._id, realNotify)
  }

  // Send Notify
  if(!!sendNotify) await sendNotifyUser({
    user: payment.user,
    color: status == 1 ? 'green' : (status == 2 ? 'red' : 'orange'),
    content: realNotify
  })
}