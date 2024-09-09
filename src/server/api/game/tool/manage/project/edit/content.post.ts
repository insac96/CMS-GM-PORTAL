import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id, content } = await readBody(event)
    if(!_id || !content) throw 'Dữ liệu đầu vào không đủ'

    const game = await DB.GameTool.findOne({ _id: _id }).select('name')
    if(!game) throw 'Trò chơi không tồn tại'

    await DB.GameTool.updateOne({ _id: _id },{ content: content })
    logAdmin(event, `Sửa nội dung giới thiệu trò chơi <b>${game.name}</b>`)

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})