import type { IAuth, IDBGameChina, IDBGameChinaUser, IDBGameChinaPayment, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    // Check Body
    const body = await readBody(event)
    const { _id : paymentID, reason, game : key } = body
    if(!paymentID) throw 'Không tìm thấy mã giao dịch'
    if(!reason) throw 'Vui lòng nhập lý do hủy'
    if(!key) throw 'Không tìm thấy mã trò chơi'

    throw 'Tính năng đang bảo trì'

    // Check Game
    const game = await DB.GameChina.findOne({ key: key, display: true }).select('name') as IDBGameChina
    if(!game) throw 'Trò chơi không tồn tại'

    // Check User Game
    const userGame = await DB.GameChinaUser.findOne({ game: game._id, user: auth._id }).select('user') as IDBGameChinaUser
    if(!userGame) throw 'Chưa có dữ liệu chơi game'

    // Check User
    const user = await DB.User.findOne({ _id: userGame.user }) as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    // Check Payment
    const payment = await DB.GameChinaPayment.findOne({ _id: paymentID }) as IDBGameChinaPayment
    if(!payment) throw 'Giao dịch không tồn tại'
    if(payment.status > 0) throw 'Không thể thao tác trên giao dịch này'
    if(payment.game.toString() !== game._id.toString()) throw 'Mã giao dịch và trò chơi không khớp'
    if(payment.user.toString() !== userGame._id.toString()) throw 'Bạn không phải chủ giao dịch'

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
