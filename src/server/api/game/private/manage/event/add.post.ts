import type { IAuth, IDBGamePrivate, IDBGamePrivateEvent } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { need, gift, game: gameID, type } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!type) throw 'Không tìm thấy loại sự kiện'
    if(!!isNaN(parseInt(need))|| parseInt(need) < 0) throw 'Điều kiện mốc không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const checkNeed = await DB.GamePrivateEvent.findOne({ need: need, type: type, game: game._id }).select('_id') as IDBGamePrivateEvent
    if(!!checkNeed) throw 'Điều kiện mốc đã tồn tại'

    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount,
    }))
    body.gift = giftFormat

    await DB.GamePrivateEvent.create(body)

    logGameAdmin(event, 'private', game._id, `Thêm vào sự kiện <b>${type}</b> mốc <b>${need}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})