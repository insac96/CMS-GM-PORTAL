import jwt from 'jsonwebtoken'
import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, token } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!token) throw 'Không tìm thấy mã ủy quyền'

    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('secret key') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const decoded = jwt.verify(token, game.secret) as any
    const url = decoded.url
    const key = game.key

    return resp(event, { result: { url, key, code } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})