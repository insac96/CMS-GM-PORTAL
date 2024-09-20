import type { IAuth, IDBGameTool, IDBGameToolRecharge } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { recharge_id, recharge_name, save_pay, game : _id } = body
    if(!_id) throw 'Không tìm thấy ID trò chơi'
    if(!recharge_id || !recharge_name || !save_pay) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GameTool.findOne({ _id: _id }).select('_id') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const checkDup = await DB.GameToolRecharge.findOne({ recharge_id: recharge_id, game: game._id }).select('_id') as IDBGameToolRecharge
    if(!!checkDup) throw 'Mã vật phẩm đã tồn tại'

    await DB.GameToolRecharge.create(body)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})