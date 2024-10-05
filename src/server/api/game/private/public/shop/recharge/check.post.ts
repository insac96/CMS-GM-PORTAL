import type { IAuth, IDBGamePrivate, IDBGamePrivateRecharge } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, item_id, item_name, price, server_id } = body
    if(!code) throw 'Không tìm thấy trò chơi'
    if(!item_id || !item_name || !price || !server_id) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const rechargeGamePrivate = await DB.GamePrivateRecharge.findOne({ 
      recharge_id: item_id,
      game: game._id
    }) as IDBGamePrivateRecharge
    
    let rechargeSend : any

    if(!rechargeGamePrivate){
      rechargeSend = {
        recharge_id: item_id,
        recharge_name: item_name,
        save_pay: price,
        price: price
      }
      const newRecharge = await DB.GamePrivateRecharge.create({
        game: game._id,
        ...rechargeSend
      })
      rechargeSend._id = newRecharge._id
    }
    else {
      rechargeSend = rechargeGamePrivate
    }

    const result = {
      recharge: rechargeSend,
      server: server_id
    }
    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})