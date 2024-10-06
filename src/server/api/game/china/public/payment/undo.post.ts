import type { IAuth, IDBGameChina, IDBGameChinaUser, IDBGameChinaPayment } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    // Check Body
    const body = await readBody(event)
    const { _id, reason, game : key } = body
    if(!_id) throw 'Không tìm thấy mã giao dịch'
    if(!reason) throw 'Vui lòng nhập lý do hủy'
    if(!key) throw 'Không tìm thấy mã trò chơi'

    // Check Game
    const game = await DB.GameChina.findOne({ key: key, display: true }).select('name') as IDBGameChina
    if(!game) throw 'Trò chơi không tồn tại'

    // Check User
    const userGame = await DB.GameChinaUser.findOne({ game: game._id, user: auth._id }).select('_id') as IDBGameChinaUser
    if(!userGame) throw 'Chưa có dữ liệu chơi game'

    // Check Payment
    const payment = await DB.GameChinaPayment.findOne({ _id: _id }) as IDBGameChinaPayment
    if(!payment) throw 'Giao dịch không tồn tại'
    if(payment.status > 0) throw 'Không thể thao tác trên giao dịch này'
    if(payment.game.toString() !== game._id.toString()) throw 'Mã giao dịch và trò chơi không khớp'
    if(payment.user.toString() !== auth._id.toString()) throw 'Bạn không phải chủ giao dịch'

    await verifyGameChinaPayment(event, {
      status: 3,
      ...body
    }, game)
    
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
