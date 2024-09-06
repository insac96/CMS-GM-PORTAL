import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, review } = body
    if(!_id || !review) throw 'Dữ liệu đầu vào không đủ'
    if(!Array.isArray(review)) throw 'Dữ liệu hình ảnh review không hợp lệ'

    const game = await DB.Game.findOne({ _id: _id }).select('name')
    if(!game) throw 'Trò chơi không tồn tại'

    delete body['_id']
    await DB.Game.updateOne({ _id: _id }, { image: body })
    logAdmin(event, `Sửa thông tin hình ảnh trò chơi <b>${game.name}</b>`)

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})