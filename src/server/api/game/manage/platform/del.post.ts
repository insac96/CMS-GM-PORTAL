import type { IAuth, IDBGamePlatform } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const platform = await DB.GamePlatform.findOne({ _id: _id }).select('name') as IDBGamePlatform
    if(!platform) throw 'Nền tảng không tồn tại'
    
    const gamesTool = await DB.GameTool.count({ platform: platform._id })
    const gamesChina = await DB.GameChina.count({ platform: platform._id })
    const gamesPrivate = await DB.GamePlatform.count({ platform: platform._id })
    if(gamesTool > 0 || gamesChina > 0 || gamesPrivate > 0) throw 'Không thể xóa nền tảng đã có trò chơi'

    await DB.GamePlatform.deleteOne({ _id: platform._id })
    logAdmin(event, `Xóa nền tảng trò chơi <b>${platform.name}</b>`)

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})