import type { IAuth, IDBGamePrivate, IDBGamePrivateRecharge } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { recharge_id, recharge_name, save_pay, price, game : gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!recharge_id || !recharge_name) throw 'Dữ liệu đầu vào sai'
    if(
      !!isNaN(parseInt(save_pay))
      || !!isNaN(parseInt(price))
      || parseInt(save_pay) <= 0
      || parseInt(price) <= 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const checkDup = await DB.GamePrivateRecharge.findOne({ recharge_id: recharge_id, game: game._id }).select('_id') as IDBGamePrivateRecharge
    if(!!checkDup) throw 'Mã vật phẩm đã tồn tại'

    await DB.GamePrivateRecharge.create(body)

    logGameAdmin(event, 'private', game._id, `Thêm gói nạp <b>${recharge_name}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})