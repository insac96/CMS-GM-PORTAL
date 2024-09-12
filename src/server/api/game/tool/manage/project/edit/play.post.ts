import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id } = body
    if(!_id) throw 'Dữ liệu đầu vào không đủ'

    const game = await DB.GameTool.findOne({ _id: _id }).select('name')
    if(!game) throw 'Trò chơi không tồn tại'

    delete body['_id']
    await DB.GameTool.updateOne({ _id: _id }, { play: body })
    logAdmin(event, `Sửa thông tin link chơi trò chơi Tool <b>${game.name}</b>`)

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})