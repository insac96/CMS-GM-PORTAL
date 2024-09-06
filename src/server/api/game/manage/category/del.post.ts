import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const category = await DB.GameCategory.findOne({ _id: _id }).select('name')
    if(!category) throw 'Thể loại không tồn tại'
    
    const games = await DB.Game.count({ category: _id })
    if(games > 0) throw 'Không thể xóa thể loại đã có trò chơi'

    await DB.GameCategory.deleteOne({ _id: _id })
    logAdmin(event, `Xóa thể loại trò chơi <b>${category.name}</b>`)

    return resp(event, { message: 'Xóa thể loại thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})