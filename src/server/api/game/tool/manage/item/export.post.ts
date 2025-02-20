import type { IAuth, IDBGameTool, IDBGameToolItem } from "~~/types"
import { join } from 'path'
import { writeFileSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { type, game : gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!type) throw 'Không tìm thấy kiểu xuất vật phẩm'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('manager code') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const items = await DB.GameToolItem.find({ game: game._id }).select('item_id item_name item_image -_id') as IDBGameToolItem[]
    const createdAt = formatDate(event, new Date())
    const filename = `json-items-${game.code}-${createdAt.day}${createdAt.month}${createdAt.year}-${createdAt.hour}-${createdAt.minute}-${createdAt.timestamp}.json`
    const filePath = join('dist/json', filename)
    writeFileSync(filePath, JSON.stringify(items, null, 2))

    return resp(event, { result: { url: `/json/${filename}`, name: filename }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})