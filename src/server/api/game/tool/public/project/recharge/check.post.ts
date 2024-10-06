import type { IAuth, IDBGameTool, IDBGameToolRecharge } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, item_id, item_name, price, server_id } = body
    if(!code) throw 'Không tìm thấy trò chơi'
    if(!item_id || !item_name || !price || !server_id) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GameTool.findOne({ code: code, display: true }).select('_id') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const recharge = await DB.GameToolRecharge.findOne({ recharge_id: item_id, game: game._id }) as IDBGameToolRecharge
    let rechargeSend : any

    if(!recharge){
      rechargeSend = {
        recharge_id: item_id,
        recharge_name: item_name,
        save_pay: price
      }
      const newRecharge = await DB.GameToolRecharge.create({
        game: game._id,
        ...rechargeSend
      })
      rechargeSend._id = newRecharge._id
    }
    else {
      rechargeSend = recharge
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