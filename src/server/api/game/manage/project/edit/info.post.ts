import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, platform, category, name, short_name, description } = body
    if(!_id || !platform || !category || !name || !short_name || !description) throw 'Dữ liệu đầu vào không hợp lệ'
    
    const game = await DB.Game.findOne({ _id: _id }).select('name short_name')
    if(!game) throw 'Trò chơi không tồn tại'

    const platformCheck = await DB.GamePlatform.findOne({ _id: platform }).select('_id')
    if(!platformCheck) throw 'Nền tảng không tồn tại'

    const categoryCheck = await DB.GameCategory.findOne({ _id: category }).select('_id')
    if(!categoryCheck) throw 'Thể loại không tồn tại'

    if(game.name != name){
      const key = formatVNString(name, '-')
      const getByKey = await DB.Game.findOne({ key: key }).select('_id')
      if(!!getByKey) throw 'Tên trò chơi đã tồn tại'
      body.key = key
    }

    if(game.short_name != short_name){
      const getByShortName = await DB.Game.findOne({ short_name: short_name }).select('_id')
      if(!!getByShortName) throw 'Tên ngắn trò chơi đã tồn tại'
    }

    delete body['_id']
    await DB.Game.updateOne({ _id: _id }, body)
    logAdmin(event, `Sửa thông tin cơ bản trò chơi <b>${game.name}</b>`)

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})