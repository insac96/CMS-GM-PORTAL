import type { IAuth, IDBGamePrivate, IDBGamePrivateItemBox } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { name, gift, game: gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!name || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const getByName = await DB.GamePrivateItemBox.findOne({ name: name, game: game._id }).select('_id') as IDBGamePrivateItemBox
    if(!!getByName) throw 'Tên gói đã tồn tại'

    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount,
    }))
    body.game = game._id
    body.gift = giftFormat

    await DB.GamePrivateItemBox.create(body)

    logGameAdmin(event, 'private', game._id, `Thêm gói vật phẩm <b>${name}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})