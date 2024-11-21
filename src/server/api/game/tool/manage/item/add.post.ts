import type { IAuth, IDBGameTool, IDBGameToolItem } from "~~/types"
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { items, game : gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!items) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('manager') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const url =  new URL(items, runtimeConfig.public.clientURL)
    const send = await axios.get(url.href)
    const res = send.data

    await DB.GameToolItem.deleteMany({ game: game._id })

    const list = res.map((i : any) => ({ 
      item_id: i.item_id, 
      item_name: i.item_name,
      game: game._id
    }))
    await DB.GameToolItem.insertMany(list)

    logGameAdmin(event, 'tool', game._id, `Thêm danh sách vật phẩm`)
    return resp(event, { message: 'Tạo mới thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})