import md5 from 'md5'
import jwt from 'jsonwebtoken'
import type { IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { username, password } = await readBody(event)
    if(!username || !password) throw 'Vui lòng nhập đầy đủ thông tin'

    // Get User
    const user = await DB.User
    .findOne({ username: username.toLowerCase() })
    .select('username password block type token') as IDBUser
    
    // Check User
    if(!user) throw 'Tài khoản không tồn tại'
    if(md5(password) != user.password) throw 'Mật khẩu không chính xác'
    if(!!user.block) throw 'Tài khoản của bạn đang bị khóa'

    // Update Ads From
    const adsFromCode = getCookie(event, 'ads-from')
    if(!!adsFromCode){
      const adsFromData = await DB.AdsFrom.findOne({ code: adsFromCode }).select('_id')
      if(!!adsFromData) await DB.AdsFrom.updateOne({ _id: adsFromData._id }, { $inc: { 'sign.in': 1 }})
      else deleteCookie(event, 'ads-from', runtimeConfig.public.cookieConfig)
    }

    // Create Token and Cookie
    const token = jwt.sign({
      _id : user._id
    }, runtimeConfig.apiSecret, { expiresIn: '360d' })

    setCookie(event, 'token-auth', token, runtimeConfig.public.cookieConfig)
    user.token = token
    await user.save()

    // Save IP
    const IP = getRequestIP(event, { xForwardedFor: true })
    const UserIP = await DB.UserIP.findOne({ user: user._id, ip: IP })
    if(!UserIP) await DB.UserIP.create({ user: user._id, ip: IP })

    // Send Notify and Save Log
    await sendNotifyUser({
      user: user._id,
      color: 'blue',
      content: `Bạn đã đăng nhập với IP <b>${IP}</b>`
    })

    logUser({
      user: user._id,
      action: `Đăng nhập với IP <b>${IP}</b>`,
      type: 'signin'
    })

    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})