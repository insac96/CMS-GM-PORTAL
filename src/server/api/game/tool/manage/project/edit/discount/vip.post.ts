import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id : gameID, month, forever } = body
    if(!gameID) throw 'Không tìm thấy mã trò chơi'
    if(!month || !forever) throw 'Dữ liệu đầu vào không đủ'
    if(!!isNaN(parseInt(month)) || parseInt(month) < 0) throw 'Dữ liệu tỷ lệ không hợp lệ'
    if(!!isNaN(parseInt(forever)) || parseInt(forever) < 0) throw 'Dữ liệu tỷ lệ không hợp lệ'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('name manager') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    delete body['_id']
    await DB.GameTool.updateOne({ _id: game._id }, { 'discount.vip': body })

    logGameAdmin(event, 'tool', game._id, `Sửa giảm giá VIP trò chơi`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})