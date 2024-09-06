import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { name, icon } = body
    if(!name || !icon) throw 'Dữ liệu đầu vào không hợp lệ'

    const key = formatVNString(name, '-')
    const getByKey = await DB.GamePlatform.findOne({ key: key }).select('_id')
    if(!!getByKey) throw 'Tên nền tảng đã tồn tại'

    body.key = key
    await DB.GamePlatform.create(body)
    logAdmin(event, `Thêm nền tảng trò chơi <b>${name}</b>`)
    
    return resp(event, { message: 'Thêm nền tảng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})