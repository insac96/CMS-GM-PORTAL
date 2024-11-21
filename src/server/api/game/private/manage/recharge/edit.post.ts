import type { IAuth, IDBGamePrivate, IDBGamePrivateRecharge } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id : rechargeID, recharge_id, recharge_name, save_pay, price, game : gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!rechargeID || !recharge_id || !recharge_name) throw 'Dữ liệu đầu vào sai'
    if(
      !!isNaN(parseInt(save_pay))
      || !!isNaN(parseInt(price))
      || parseInt(save_pay) <= 0
      || parseInt(price) <= 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const recharge = await DB.GamePrivateRecharge.findOne({ _id: rechargeID, game: game._id }).select('recharge_id recharge_name') as IDBGamePrivateRecharge
    if(!recharge) throw 'Gói không tồn tại'

    if(recharge.recharge_id != recharge_id){
      const checkDup = await DB.GamePrivateRecharge.findOne({ recharge_id: recharge_id, game: game._id }).select('_id') as IDBGamePrivateRecharge
      if(!!checkDup) throw 'Mã vật phẩm đã tồn tại'
    }

    delete body['_id']
    delete body['game']
    await DB.GamePrivateRecharge.updateOne({ _id: recharge._id }, body)
    
    logGameAdmin(event, 'private', game._id, `Sửa gói nạp <b>${recharge.recharge_name}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})