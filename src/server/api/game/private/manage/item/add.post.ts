import type { IAuth, IDBGamePrivate, IDBGamePrivateItem } from "~~/types"
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { items, game : gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!items) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const url =  new URL(items, runtimeConfig.public.clientURL)
    const send = await axios.get(url.href)
    const res = send.data

    await DB.GamePrivateItem.deleteMany({})

    const list = res.map((i : IDBGamePrivateItem) => ({ 
      item_id: i.item_id, 
      item_name: i.item_name,
      item_image: i.item_image,
      game: game._id
    }))
    list.forEach(async (i : IDBGamePrivateItem) => {
      const check = await DB.GamePrivateItem.findOne({ item_id: i.item_id, game: game._id }).select('_id') as IDBGamePrivateItem
      if(!!check) await DB.GamePrivateItem.updateOne({ _id: check._id }, i)
      else await DB.GamePrivateItem.create(i)
    })

    return resp(event, { message: 'Tạo mới thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})