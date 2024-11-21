import type { IAuth, IDBGameCategory, IDBGamePlatform, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id : gameID, platform, category, name, code, description } = body
    if(!gameID) throw 'Không tìm thấy mã trò chơi'
    if(!platform || !category || !name || !code || !description) throw 'Dữ liệu đầu vào không hợp lệ'
    
    const game = await DB.GameTool.findOne({ _id: gameID }).select('name code manager') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const platformCheck = await DB.GamePlatform.findOne({ _id: platform }).select('_id') as IDBGamePlatform
    if(!platformCheck) throw 'Nền tảng không tồn tại'

    const categoryCheck = await DB.GameCategory.findOne({ _id: category }).select('_id') as IDBGameCategory
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
    await DB.GameTool.updateOne({ _id: game._id }, body)

    logGameAdmin(event, 'tool', game._id, `Sửa thông tin trò chơi`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})