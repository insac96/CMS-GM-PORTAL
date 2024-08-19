import jwt from 'jsonwebtoken'
import md5 from 'md5'
import type { IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    throw 'Chức năng lấy mật khẩu đang bảo trì'
    
    const runtimeConfig = useRuntimeConfig()
    const { username, password, phone } = await readBody(event)
    if(!username || !phone || !password) throw 'Vui lòng nhập đủ thông tin'
    if (password.length < 6 || password.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'
    if (!!password.match(/\s/g)) throw 'Mật khẩu không có khoảng cách'
    if (!phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) throw 'Định dạng số điện thoại không đúng'

    const user = await DB.User
    .findOne({ username: username.toLowerCase() })
    .select('phone password block type') as IDBUser

    if(!user) throw 'Tài khoản không tồn tại'
    if(user.type > 0) throw 'Không thể lấy lại mật khẩu của quản trị viên'
    if(!!user.block) throw 'Tài khoản đang bị khóa, không thể lấy lại mật khẩu'
    if(user.phone != phone) throw 'Số điện thoại của tài khoản không đúng'

    const token = jwt.sign({
      _id : user._id
    }, runtimeConfig.apiSecret, { expiresIn: '360d' })

    setCookie(event, 'token-auth', token, runtimeConfig.public.cookieConfig)
    user.password = md5(password)
    user.token = token
    await user.save()

    await sendNotifyUser({
      user: user._id,
      color: 'blue',
      content: `Bạn đã thao tác lấy lại <b>mật khẩu</b> tài khoản`
    })

    const IP = getRequestIP(event, { xForwardedFor: true })
    logUser(event, user._id, `Thao tác lấy lại <b>mật khẩu</b> tài khoản bằng IP <b>${IP}</b>`)

    return resp(event, { message: 'Lấy lại mật khẩu thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})