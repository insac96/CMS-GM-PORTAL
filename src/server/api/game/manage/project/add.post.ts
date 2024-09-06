import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { platform, category, name, short_name, description } = body
    if(!platform || !category || !name || !short_name || !description) throw 'Dữ liệu đầu vào không hợp lệ'

    const platformCheck = await DB.GamePlatform.findOne({ _id: platform }).select('_id')
    if(!platformCheck) throw 'Nền tảng không tồn tại'

    const categoryCheck = await DB.GameCategory.findOne({ _id: category }).select('_id')
    if(!categoryCheck) throw 'Thể loại không tồn tại'

    const key = formatVNString(name, '-')
    const nameCheck = await DB.Game.findOne({ key: key }).select('_id')
    if(!!nameCheck) throw 'Tên trò chơi đã tồn tại'

    const shortNameCheck = await DB.Game.findOne({ short_name: short_name }).select('_id')
    if(!!shortNameCheck) throw 'Tên ngắn trò chơi đã tồn tại'

    body.key = key
    await DB.Game.create(body)
    logAdmin(event, `Thêm trò chơi <b>${name}</b>`)

    return resp(event, { message: 'Thêm trò chơi thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})