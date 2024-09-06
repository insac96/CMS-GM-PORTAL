import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, name, icon } = body
    if(!_id || !name || !icon) throw 'Dữ liệu đầu vào không hợp lệ'

    const category = await DB.GameCategory.findOne({ _id: _id }).select('name')
    if(!category) throw 'Thể loại không tồn tại'

    if(category.name != name){
      const key = formatVNString(name, '-')
      const getByKey = await DB.GameCategory.findOne({ key: key }).select('_id')
      if(!!getByKey) throw 'Tên thể loại đã tồn tại'
      body.key = key
    }

    delete body['_id']
    await DB.GameCategory.updateOne({ _id: _id }, body)
    logAdmin(event, `Sửa thông tin thể loại trò chơi <b>${category.name}</b>`)

    return resp(event, { message: 'Sửa thể loại thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})