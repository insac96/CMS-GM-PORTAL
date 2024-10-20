import type { IAuth, IDBGameCategory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const category = await DB.GameCategory.findOne({ _id: _id }).select('name') as IDBGameCategory
    if(!category) throw 'Thể loại không tồn tại'
    
    const gamesTool = await DB.GameTool.count({ category: category._id })
    const gamesChina = await DB.GameChina.count({ category: category._id })
    const gamesPrivate = await DB.GamePlatform.count({ category: category._id })
    if(gamesTool > 0 || gamesChina > 0 || gamesPrivate > 0) throw 'Không thể xóa nền tảng đã có trò chơi'

    await DB.GameCategory.deleteOne({ _id: category._id })
    logAdmin(event, `Xóa thể loại trò chơi <b>${category.name}</b>`)

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})