import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { platform, category, name, code, description } = body
    if(!platform || !category || !name || !code || !description) throw 'Dữ liệu đầu vào không hợp lệ'

    const platformCheck = await DB.GamePlatform.findOne({ _id: platform }).select('_id')
    if(!platformCheck) throw 'Nền tảng không tồn tại'

    const categoryCheck = await DB.GameCategory.findOne({ _id: category }).select('_id')
    if(!categoryCheck) throw 'Thể loại không tồn tại'

    const key = formatVNString(name, '-')
    const nameCheck = await DB.GameTool.findOne({ key: key }).select('_id')
    if(!!nameCheck) throw 'Tên trò chơi đã tồn tại'

    const codeCheck = await DB.GameTool.findOne({ code: code }).select('_id')
    if(!!codeCheck) throw 'Tên ngắn trò chơi đã tồn tại'

    body.key = key
    await DB.GameTool.create(body)
    logAdmin(event, `Thêm trò chơi <b>${name}</b>`)

    return resp(event, { message: 'Thêm trò chơi thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})