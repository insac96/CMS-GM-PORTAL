import md5 from 'md5'
import { IDBGamePrivate, IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const { account, code: gameCode, ecoin, sign, server, role } = await readBody(event)
    if(!gameCode) throw 'Không tìm thấy mã trò chơi'
    if(!account) throw 'Không tìm thấy tài khoản'
    if(!sign) throw 'Không tìm thấy mã ủy quyền'
    if(!!isNaN(parseInt(ecoin))) throw 'ECoin không hợp lệ'
    if(parseInt(ecoin) < 1) throw 'Số ECoin rút tối thiểu là 1'
    if(!server || !role) throw 'Không tìm thấy máy chủ và nhân vật'

    // Check Sign
    const signCheck = md5('ENI-'+account+''+gameCode+''+ecoin+''+server+''+role)
    if(signCheck != sign) throw 'Mã ủy quyền không hợp lệ'

    // Get User
    const user = await DB.User.findOne({ username: account }).select('_id') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    
    // Get Game
    const game = await DB.GamePrivate.findOne({ code: gameCode }).select('name') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    // Update
    await DB.User.updateOne({ _id: user._id }, { $inc: { 'currency.ecoin': ecoin }})

    // Log
    await logUser({
      user: user._id,
      type: 'ecoin.exchange.game',
      action: `Nhận <b>${ecoin.toLocaleString("vi-VN")}</b> ECoin từ quy đổi vật phẩm trong <b>[Game Private] ${game.name}</b> tại máy chủ <b>${server}</b> với nhân vật <b>${role}</b>`,
      target: game._id.toString()
    })

    return resp(event, { message: 'Quy đổi thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})