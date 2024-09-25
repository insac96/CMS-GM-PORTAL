import type { IAuth, IDBGameTool, IDBGameToolItem } from "~~/types"
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { items, game : _id } = body
    if(!_id) throw 'Không tìm thấy ID trò chơi'
    if(!items) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GameTool.findOne({ _id: _id }).select('_id') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const url =  new URL(items, runtimeConfig.public.clientURL)
    const send = await axios.get(url.href)
    const res = send.data

    await DB.GameToolItem.deleteMany({})

    const list = res.map((i : any) => ({ 
      item_id: i.item_id, 
      item_name: i.item_name,
      game: game._id
    }))
    await DB.GameToolItem.insertMany(list)

    return resp(event, { message: 'Tạo mới thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})