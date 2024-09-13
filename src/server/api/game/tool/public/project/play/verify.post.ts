import md5 from "md5"
import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, token } = body
    if(!code) throw true

    const game = await DB.GameTool.findOne({ code: code, display: true }).select('ip api secret') as IDBGameTool
    if(!game) throw true
    if(!game.ip) throw true

    const url = await gameStart(event, {
      url: game.api.start,
      secret: game.secret,
      account: auth.username
    })
    const tokenCheck = md5(`${url}.${auth.username}.${game.secret}`)
    if(tokenCheck != token) throw true

    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { result: false })
  }
})