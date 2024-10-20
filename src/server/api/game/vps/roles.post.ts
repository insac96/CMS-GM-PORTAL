import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { server_id, size, current, sort, search, game: code, type } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!type) throw 'Không tìm thấy loại trò chơi'
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!server_id) throw 'Vui lòng chọn máy chủ trước'

    let DBSelect : any
    if(type == 'tool') DBSelect = DB.GameTool
    if(type == 'private') DBSelect = DB.GamePrivate

    const game = await DBSelect.findOne({ code: code }).select('_id ip api secret')
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const { list, total } = await gameGetRoles(event, {
      url: game.api.roles,
      secret: game.secret,
      ...body
    })
    return resp(event, { result: { list, total }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})