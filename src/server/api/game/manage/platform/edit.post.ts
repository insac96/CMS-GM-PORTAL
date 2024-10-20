import type { IAuth, IDBGamePlatform } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id, name, icon } = body
    if(!_id || !name || !icon) throw 'Dữ liệu đầu vào không hợp lệ'

    const platform = await DB.GamePlatform.findOne({ _id: _id }).select('name') as IDBGamePlatform
    if(!platform) throw 'Nền tảng không tồn tại'

    if(platform.name != name){
      const key = formatVNString(name, '-')
      const getByKey = await DB.GamePlatform.findOne({ key: key }).select('_id') as IDBGamePlatform
      if(!!getByKey) throw 'Tên nền tảng đã tồn tại'
      body.key = key
    }

    delete body['_id']
    await DB.GamePlatform.updateOne({ _id: platform._id }, body)
    logAdmin(event, `Sửa thông tin nền tảng trò chơi <b>${platform.name}</b>`)

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})