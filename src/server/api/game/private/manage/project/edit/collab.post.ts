import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id : gameID, collab } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy mã trò chơi'
    if(!collab) throw 'Dữ liệu đầu vào không đủ'
    if(!!isNaN(parseInt(collab.commission)) || parseInt(collab.commission) < 0) throw 'Tỷ lệ hoa hồng không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('name collab') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    game.collab.commission = collab.commission

    // @ts-expect-error
    await game.save()

    logGameAdmin(event, 'china', game._id, `Sửa thông tin CTV trò chơi`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})