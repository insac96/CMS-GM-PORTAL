import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: _id }).select('name') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    // await DB.GamePrivateServerOpen.deleteMany({ game: game._id })
    await DB.GamePrivateUser.deleteMany({ game: game._id })
    await DB.GamePrivateUserLogin.deleteMany({ game: game._id })
    await DB.GamePrivateRechargeHistory.deleteMany({ game: game._id })
    await DB.GamePrivateShopItemHistory.deleteMany({ game: game._id })
    await DB.GamePrivateShopPackHistory.deleteMany({ game: game._id })
    await DB.GamePrivateGiftcodeHistory.deleteMany({ game: game._id })
    await DB.GamePrivateEventHistory.deleteMany({ game: game._id })
    await DB.GamePrivateComment.deleteMany({ game: game._id })
    await DB.GamePrivateLogAdmin.deleteMany({ game: game._id })
    await DB.GamePrivate.updateOne({ _id: game._id },{
      statistic: {
        play: 0,
        view: 0,
        user: 0,
        revenue: 0,
      },
    })

    logGameAdmin(event, 'private', game._id, `Reset trò chơi`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})