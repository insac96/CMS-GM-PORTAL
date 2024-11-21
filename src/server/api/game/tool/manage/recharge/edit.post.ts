import type { IAuth, IDBGameTool, IDBGameToolRecharge } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, recharge_id, recharge_name, save_pay, game : gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id || !recharge_id || !recharge_name || !save_pay) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('manager') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const recharge = await DB.GameToolRecharge.findOne({ _id: _id, game: game._id }).select('recharge_id recharge_name') as IDBGameToolRecharge
    if(!recharge) throw 'Gói không tồn tại'

    if(recharge.recharge_id != recharge_id){
      const checkDup = await DB.GameToolRecharge.findOne({ recharge_id: recharge_id, game: game._id }).select('_id') as IDBGameToolRecharge
      if(!!checkDup) throw 'Mã vật phẩm đã tồn tại'
    }

    delete body['_id']
    delete body['game']
    await DB.GameToolRecharge.updateOne({ _id: recharge._id }, body)
    
    logGameAdmin(event, 'tool', game._id, `Sửa gói nạp <b>${recharge.recharge_name}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})