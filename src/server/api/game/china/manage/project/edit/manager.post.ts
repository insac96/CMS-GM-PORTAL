import type { IAuth, IDBGameChina } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id : gameID, manager } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy mã trò chơi'
    if(!manager) throw 'Dữ liệu đầu vào không đủ'

    const game = await DB.GameChina.findOne({ _id: gameID }).select('name manager') as IDBGameChina
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    await DB.GameChina.updateOne({ _id: game._id },{ manager: manager })

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})