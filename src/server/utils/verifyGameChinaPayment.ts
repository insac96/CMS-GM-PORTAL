import type { H3Event } from 'h3'
import type { Types } from 'mongoose'
import type { IDBGameChina, IDBGameChinaPayment, IDBGameChinaUser, IDBUser } from '~~/types'

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
  const payment = await DB.GameChinaPayment.findOne({ game: game._id, _id: _id }) as IDBGameChinaPayment
  if(!payment) throw 'Giao dịch không tồn tại'
  if(payment.status > 0) throw 'Không thể thao tác trên giao dịch này'

  // Get User Game
  const userGame = await DB.GameChinaUser.findOne({ game: game._id, _id: payment.user }).select('user') as IDBGameChinaUser
  if(!userGame) throw 'Chưa có dữ liệu chơi game'

  // Get Other
  const bot = await DB.User.findOne({'username': 'bot'}).select('_id') as IDBUser
  if(!bot) throw 'Không tìm thấy thông tin Bot'
  const user = await DB.User.findOne({ _id: userGame.user }).select('_id') as IDBUser
  if(!user) throw 'Không tìm thấy thông tin tài khoản'


  // Update Payment
  const time = new Date()
  const verify_person = status == 3 ? user._id : (!!verifier ? verifier : bot._id)
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
    // Update revenue game
    await DB.GameChina.updateOne({ _id: game._id }, { $inc: { 'statistic.revenue': payment.coin }})

    realNotify = `
      Bạn được duyệt thành công giao dịch nạp
      <b>[Game China] ${game.name}</b>, mã giao dịch <b>${payment.code}</b>
    `

    logUser({ 
      user: user._id, 
      action: `
        Nạp thành công <b>${payment.coin.toLocaleString('vi-VN')}</b> 
        vào <b>[Game China] ${game.name}</b>, mã giao dịch <b>${payment.code}</b>
      `, 
      type: 'game.china.pay.success',
      target: game._id.toString()
    })

    logAdmin(event, `Chấp nhận giao dịch nạp tiền nền tảng <b>${payment.code}</b>`, verify_person)
    logGameAdmin(event, 'china', game._id, `Chấp nhận giao dịch nạp tiền nền tảng <b>${payment.code}</b>`, verify_person)
  }
  if(status == 2){
    await DB.User.updateOne({ _id: user._id }, { $inc: { 'currency.coin': payment.coin }})
    
    realNotify = `
      Bạn bị từ chối giao dịch nạp 
      <b>[Game China] ${game.name}</b>, mã giao dịch <b>${payment.code}</b> 
      với lý do <b>${reason}</b> 
      và được hoàn lại <b>${payment.coin.toLocaleString('vi-VN')}</b> Xu 
    `

    logUser({ 
      user: user._id, 
      action: `
        Hoàn lại <b>${payment.coin.toLocaleString('vi-VN')}</b> Xu 
        từ lệnh từ chối giao dịch nạp 
        <b>[Game China] ${game.name}</b>, mã giao dịch <b>${payment.code}</b>
      `, 
      type: 'game.china.pay.refuse',
      target: game._id.toString()
    })

    logAdmin(event, `Từ chối giao dịch nạp tiền nền tảng <b>${payment.code}</b>`, verify_person)
    logGameAdmin(event, 'china', game._id, `Từ chối giao dịch nạp tiền nền tảng <b>${payment.code}</b>`, verify_person)
  }
  if(status == 3){
    await DB.User.updateOne({ _id: user._id }, { $inc: { 'currency.coin': payment.coin }})

    realNotify = `
      Hoàn lại <b>${payment.coin.toLocaleString('vi-VN')}</b> Xu 
      từ lệnh hoàn tác giao dịch nạp 
      <b>[Game China] ${game.name}</b>, mã giao dịch <b>${payment.code}</b>
    `

    logUser({ 
      user: user._id, 
      action: realNotify, 
      type: 'game.china.pay.undo',
      target: game._id.toString()
    })
  }

  // Send Notify
  if(!!sendNotify) await sendNotifyUser({
    user: user._id as Types.ObjectId,
    color: status == 1 ? 'green' : (status == 2 ? 'red' : 'orange'),
    content: realNotify
  })
}