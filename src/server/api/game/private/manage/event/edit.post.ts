import type { IAuth, IDBGamePrivate, IDBGamePrivateEvent } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, need, gift, type, game: gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!type) throw 'Không tìm thấy loại sự kiện'
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(need))|| parseInt(need) < 0) throw 'Điều kiện mốc không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const eventData = await DB.GamePrivateEvent.findOne({ _id: _id, type: type, game: game._id }).select('need type') as IDBGamePrivateEvent
    if(!eventData) throw 'Mốc sự kiện không tồn tại'

    if(eventData.need != need){
      const checkNeed = await DB.GamePrivateEvent.findOne({ need: need, type: type, game: game._id }).select('_id') as IDBGamePrivateEvent
      if(!!checkNeed) throw 'Điều kiện mốc đã tồn tại'
    }

    delete body['game']
    delete body['type']
    delete body['_id']
    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount,
    }))
    body.gift = giftFormat

    await DB.GamePrivateEvent.updateOne({ _id: eventData._id }, body)

    logGameAdmin(event, 'private', game._id, `Sửa mốc <b>${eventData.need}</b> của sự kiện <b>${eventData.type}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})