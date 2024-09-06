import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, recharge, mail } = body
    if(!_id || !recharge || !mail) throw 'Dữ liệu đầu vào không đủ'
    if(!!isNaN(parseInt(recharge)) || parseInt(recharge) < 1) throw 'Dữ liệu tiền tệ không hợp lệ'
    if(!!isNaN(parseInt(mail)) || parseInt(mail) < 1) throw 'Dữ liệu tiền tệ không hợp lệ'

    const game = await DB.Game.findOne({ _id: _id }).select('name')
    if(!game) throw 'Trò chơi không tồn tại'

    delete body['_id']
    await DB.Game.updateOne({ _id: _id }, { price: body })
    logAdmin(event, `Sửa thông tin giá bán tool trò chơi <b>${game.name}</b>`)

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})