import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không đủ'

    const game = await DB.GamePrivate
    .findOne({ _id: _id })
    .select('content') 

    if(!game) throw 'Trò chơi không tồn tại'
    return resp(event, { result: game.content })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})