import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, platform, category, name, code, description } = body
    if(!_id || !platform || !category || !name || !code || !description) throw 'Dữ liệu đầu vào không hợp lệ'
    
    const game = await DB.GameTool.findOne({ _id: _id }).select('name code')
    if(!game) throw 'Trò chơi không tồn tại'

    const platformCheck = await DB.GamePlatform.findOne({ _id: platform }).select('_id')
    if(!platformCheck) throw 'Nền tảng không tồn tại'

    const categoryCheck = await DB.GameCategory.findOne({ _id: category }).select('_id')
    if(!categoryCheck) throw 'Thể loại không tồn tại'

    if(game.name != name){
      const key = formatVNString(name, '-')
      const getByKey = await DB.GameTool.findOne({ key: key }).select('_id')
      if(!!getByKey) throw 'Tên trò chơi đã tồn tại'
      body.key = key
    }

    if(game.code != code){
      const getByCode = await DB.GameTool.findOne({ code: code }).select('_id')
      if(!!getByCode) throw 'Tên ngắn trò chơi đã tồn tại'
    }

    delete body['_id']
    await DB.GameTool.updateOne({ _id: _id }, body)
    logAdmin(event, `Sửa thông tin cơ bản trò chơi <b>${game.name}</b>`)

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})