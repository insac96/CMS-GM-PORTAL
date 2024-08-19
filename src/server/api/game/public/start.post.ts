import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { username, role, server } = body

    const user = await DB.User.findOne({ username: username }).select('_id')
    if(!user) throw 'Tài khoản không tồn tại'

    const url = await gameStart(event, username)
    setCookie(event, 'play-admin-url', JSON.stringify({
      url: url,
      user: user._id,
      role: role,
      server: server
    }), runtimeConfig.public.cookieConfig)
    return resp(event, { result: 'Playing' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})