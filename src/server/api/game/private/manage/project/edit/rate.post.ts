import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id : gameID, shop } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!shop) throw 'Dữ liệu đầu vào không đủ'
    if(!shop.limit) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(shop.default)) || parseInt(shop.default) < 0) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(shop.limit.number)) || parseInt(shop.limit.number) < 0) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('name manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    await DB.GamePrivate.updateOne({ _id: game._id },{ 
      rate: { shop: shop }
    })

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})