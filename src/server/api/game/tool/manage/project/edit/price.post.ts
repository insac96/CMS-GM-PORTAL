import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id : gameID, recharge, mail } = body
    if(!gameID) throw 'Không tìm thấy mã trò chơi'
    if(!recharge || !mail) throw 'Dữ liệu đầu vào không đủ'
    if(!!isNaN(parseInt(recharge)) || parseInt(recharge) < 1) throw 'Dữ liệu tiền tệ không hợp lệ'
    if(!!isNaN(parseInt(mail)) || parseInt(mail) < 1) throw 'Dữ liệu tiền tệ không hợp lệ'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('name manager') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    delete body['_id']
    await DB.GameTool.updateOne({ _id: game._id }, { price: body })

    logGameAdmin(event, 'tool', game._id, `Sửa giá mua Tool trò chơi`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})