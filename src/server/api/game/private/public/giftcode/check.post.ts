import type { IAuth, IDBGamePrivate, IDBGamePrivateGiftcode, IDBGamePrivateItem, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    // Check Body
    const body = await readBody(event)
    const { game : gameCode, code } = body
    if(!gameCode) throw 'Không tìm thấy mã trò chơi'
    if(!code) throw 'Vui lòng nhập đầy đủ mã'

    // Check Game
    const game = await DB.GamePrivate.findOne({ code: gameCode, display: true }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    // Check User Game
    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: auth._id }).select('_id') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi game trước khi nhập mã'

    // Check Giftcode
    const upCode = code.trim().toUpperCase()
    const giftcode = await DB.GamePrivateGiftcode
    .findOne({ code: upCode, game: game._id, display: true })
    .populate({ path: 'gift.item', select: 'item_id item_name item_image' }) as IDBGamePrivateGiftcode

    // Check Giftcode
    if(!giftcode) throw 'Mã không tồn tại'
    if(giftcode.gift.length == 0) throw 'Mã chưa có phần thưởng để nhận'

    // Result
    const result : any = JSON.parse(JSON.stringify(giftcode))
    result.gift = giftcode.gift.map(gift => ({
      item_name: (gift.item as IDBGamePrivateItem).item_name,
      item_image: (gift.item as IDBGamePrivateItem).item_image,
      item_id: (gift.item as IDBGamePrivateItem).item_id,
      amount: gift.amount
    }))

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
