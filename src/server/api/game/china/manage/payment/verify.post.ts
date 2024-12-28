import type { IAuth, IDBGameChina, IDBGameChinaPayment } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id : paymentID, status, reason, game : gameID } = body
    if(!paymentID) throw 'Không tìm thấy mã giao dịch'
    if(!gameID) throw 'Không tìm thấy mã trò chơi'
    if(!status) throw 'Trạng thái đầu vào không hợp lệ'
    if(status == 2 && !reason) throw 'Vui lòng nhập lý do hủy'

    // Check Game
    const game = await DB.GameChina.findOne({ _id: gameID }).select('name manager collab') as IDBGameChina
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)
    
    // Check Payment
    const payment = await DB.GameChinaPayment.findOne({ _id: paymentID }) as IDBGameChinaPayment
    if(!payment) throw 'Giao dịch không tồn tại'
    if(payment.status > 0) throw 'Không thể thao tác trên giao dịch này'
    if(payment.game.toString() !== game._id.toString()) throw 'Mã giao dịch và trò chơi không khớp'

    await verifyGameChinaPayment(event, body, game, auth._id)
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})