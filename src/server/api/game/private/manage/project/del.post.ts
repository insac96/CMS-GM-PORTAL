import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: _id }).select('name') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    await DB.GamePrivateServerOpen.deleteMany({ game: game._id })
    await DB.GamePrivateUser.deleteMany({ game: game._id })
    await DB.GamePrivateUserLogin.deleteMany({ game: game._id })
    await DB.GamePrivateRecharge.deleteMany({ game: game._id })
    await DB.GamePrivateRechargeHistory.deleteMany({ game: game._id })
    await DB.GamePrivateItem.deleteMany({ game: game._id })
    await DB.GamePrivateItemBox.deleteMany({ game: game._id })
    await DB.GamePrivateShopItem.deleteMany({ game: game._id })
    await DB.GamePrivateShopItemHistory.deleteMany({ game: game._id })
    await DB.GamePrivateShopPack.deleteMany({ game: game._id })
    await DB.GamePrivateShopPackHistory.deleteMany({ game: game._id })
    await DB.GamePrivateGiftcode.deleteMany({ game: game._id })
    await DB.GamePrivateGiftcodeHistory.deleteMany({ game: game._id })
    await DB.GamePrivateEvent.deleteMany({ game: game._id })
    await DB.GamePrivateEventHistory.deleteMany({ game: game._id })
    await DB.GamePrivateComment.deleteMany({ game: game._id })
    await DB.GamePrivate.deleteOne({ _id: game._id })

    return resp(event, { message: 'Xóa trò chơi thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})