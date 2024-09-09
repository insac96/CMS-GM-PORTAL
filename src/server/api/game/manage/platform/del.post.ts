import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const platform = await DB.GamePlatform.findOne({ _id: _id }).select('name')
    if(!platform) throw 'Nền tảng không tồn tại'
    
    const games = await DB.GameTool.count({ platform: _id })
    if(games > 0) throw 'Không thể xóa nền tảng đã có trò chơi'

    await DB.GamePlatform.deleteOne({ _id: _id })
    logAdmin(event, `Xóa nền tảng trò chơi <b>${platform.name}</b>`)

    return resp(event, { message: 'Xóa nền tảng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})