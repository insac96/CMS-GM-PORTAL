import type { IAuth, IDBGamePrivate, IDBGamePrivateGiftcode, IDBGamePrivateItem, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    // Check Body
    const body = await readBody(event)
    const { game : gameCode, code, server, role } = body
    if(!gameCode) throw 'Không tìm thấy mã trò chơi'
    if(!code) throw 'Không tìm thấy mã quà tặng'
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'

    // Check Game
    const game = await DB.GamePrivate.findOne({ code: gameCode, display: true }).select('ip api secret') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    // Check User Game
    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: auth._id }).select('_id') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi game trước khi nhận thưởng'

    // Check Giftcode
    const upCode = code.trim().toUpperCase()
    const giftcode = await DB.GamePrivateGiftcode
    .findOne({ code: upCode, game: game._id, display: true })
    .populate({ path: 'gift.item', select: 'item_id item_name' }) as IDBGamePrivateGiftcode
    if(!giftcode) throw 'Mã không tồn tại'
    if(giftcode.gift.length == 0) throw 'Mã chưa có phần thưởng để nhận'

    // Check Time
    if(giftcode.expired){
      const now = DayJS().unix()
      const expired = DayJS(giftcode.expired).unix()
      if(now > expired) throw 'Mã đã hết hạn sử dụng'
    }

    // Check Limit
    if(giftcode.limit > 0){
      const countReceive = await DB.GamePrivateGiftcodeHistory.count({ giftcode: giftcode._id })
      if(countReceive >= giftcode.limit) throw 'Mã này đã hết lượt sử dụng'
    }

    // Check Use
    if(!giftcode.justone){
      const countReceiveUser = await DB.GamePrivateGiftcodeHistory.count({ user: userGame._id, giftcode: giftcode._id, server: server })
      if(countReceiveUser > 0) throw 'Bạn đã nhận mã này ở máy chủ này rồi'
    }
    else {
      const countReceiveUser = await DB.GamePrivateGiftcodeHistory.count({ user: userGame._id, giftcode: giftcode._id })
      if(countReceiveUser > 0) throw 'Mã này chỉ được dùng 1 lần duy nhất'
    }

    // Format Gift
    const giftItem : Array<any> = []
    giftcode.gift.forEach(gift => {
      const item = gift.item as IDBGamePrivateItem
      giftItem.push({ id: item.item_id, amount: gift.amount })
    })

    await gameSendMail(event, {
      url: game.api.mail,
      secret: game.secret,
      account: auth.username,
      server_id: server,
      role_id: role,
      title: 'Web Giftcode',
      content: 'Vật phẩm nhận từ Giftcode trên Web',
      items: giftItem
    })

    // History
    await DB.GamePrivateGiftcodeHistory.create({
      game: game._id,
      user: userGame._id,
      giftcode: giftcode._id,
      server: server,
      role: role
    })

    return resp(event, { message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
