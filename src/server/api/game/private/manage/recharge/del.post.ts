import type { IAuth, IDBGamePrivate, IDBGamePrivateRecharge } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, game : gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const recharge = await DB.GamePrivateRecharge.findOne({ _id: _id, game: game._id }).select('recharge_name') as IDBGamePrivateRecharge
    if(!recharge) throw 'Gói không tồn tại'

    const history = await DB.GamePrivateRechargeHistory.count({ recharge: recharge._id })
    if(history > 0) throw 'Không thể xóa gói nạp đã có lịch sử mua'

    await DB.GamePrivateRecharge.deleteOne({ _id: recharge._id })
    await DB.GamePrivateRechargeHistory.deleteMany({ recharge: recharge._id })

    logGameAdmin(event, 'private', game._id, `Xóa gói nạp <b>${recharge.recharge_name}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})