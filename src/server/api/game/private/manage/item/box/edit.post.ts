import type { IAuth, IDBGamePrivate, IDBGamePrivateItemBox } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, name, gift, game: gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id || !name || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const itembox = await DB.GamePrivateItemBox.findOne({ _id: _id, game: game._id }).select('name') as IDBGamePrivateItemBox
    if(!itembox) throw 'Gói không tồn tại'

    if(itembox.name != name){
      const getByName = await DB.GamePrivateItemBox.findOne({ name: name, game: game._id }).select('_id') as IDBGamePrivateItemBox
      if(!!getByName) throw 'Tên gói đã tồn tại'
    }

    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount
    }))
    body.gift = giftFormat
    await DB.GamePrivateItemBox.updateOne({ _id: itembox._id }, body)

    logGameAdmin(event, 'private', game._id, `Sửa gói vật phẩm <b>${itembox.name}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})