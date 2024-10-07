import type { IAuth, IDBGamePrivateItem, IDBGamePrivateEvent, IDBGamePrivate, IDBGamePrivateUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { server, role, event : eventID, game : code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!eventID) throw 'Không tìm thấy ID sự kiện'
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'

    // Check Game
    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('ip api secret') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    // Check User Game
    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: auth._id }).select('_id') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi game trước khi nhận thưởng'

    // Event
    const eventData = await DB.GamePrivateEvent
    .findOne({ _id: eventID, game: game._id, display: true })
    .populate({ path: 'gift.item', select: 'item_id item_name' }) as IDBGamePrivateEvent
    if(!eventData) throw 'Mốc thưởng không tồn tại'
    if(eventData.gift.length == 0) throw 'Mốc thưởng chưa có phần thưởng để nhận'

    // Check Active
    const active = await getGamePrivateEventActive(event, eventData, eventData.type)
    if(active != 0) throw 'Bạn chưa đủ điều kiện để nhận'

    // Format Gift
    const giftItem : Array<any> = []
    eventData.gift.forEach(gift => {
      const item = gift.item as IDBGamePrivateItem
      giftItem.push({ id: item.item_id, amount: gift.amount })
    })

    // Send Gift
    await gameSendMail(event, {
      url: game.api.mail,
      secret: game.secret,
      account: auth.username,
      server_id: server,
      role_id: role,
      title: 'Web Event',
      content: 'Vật phẩm nhận từ sự kiện trên Web',
      items: giftItem
    })
      

    // Pay Days
    if(eventData.type == 'pay.running'){
      const endDay = await DB.GamePrivateEvent.
      findOne({ type: 'pay.running', game: game._id })
      .select('need')
      .sort({ need: -1 }) as IDBGamePrivateEvent

      if(endDay.need == eventData.need){
        await DB.GamePrivateUser.updateOne({ _id: userGame._id, game: game._id }, {
          'pay.running.day': 0,
          'pay.running.receive': 0,
        })
      }
      else {
        await DB.GamePrivateUser.updateOne({ _id: userGame._id, game: game._id }, {
          'pay.running.receive': eventData.need
        })
      }
    }
    
    // History
    await DB.GamePrivateEventHistory.create({
      game: game._id,
      user: userGame._id,
      event: eventData._id,
      server: server,
      role: role
    })

    return resp(event, { message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})