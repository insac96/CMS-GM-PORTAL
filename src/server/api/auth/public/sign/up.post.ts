import jwt from 'jsonwebtoken'
import md5 from 'md5'
import type { IDBAdsFrom, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { username, password, email, phone } = await readBody(event)

    if (!username) throw 'Vui lòng nhập tài khoản'
    if (username.length < 6 || username.length > 12) throw 'Tài khoản trong khoảng 6-12 ký tự'
    if (!!username.match(/\s/g)) throw 'Tài khoản không có khoảng cách'
    if (!(/^[a-z0-9]*$/g).test(username)) throw 'Tài khoản không có ký tự đặc biệt và chữ viết hoa'
    if (!(/^[a-z][a-z0-9]*$/g).test(username)) throw 'Bắt đầu phải bằng một chữ cái'
    if (!!username.includes('admin')
      || !!username.includes('smod')
      || !!username.includes('robot')
    ) throw 'Tài khoản không hợp lệ'

    if (!email) throw 'Vui lòng nhập Email'
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) throw 'Định dạng Email không đúng'

    if (!phone) throw 'Vui lòng nhập số điện thoại'
    if (!phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) throw 'Định dạng số điện thoại không đúng'

    if (!password) throw 'Vui lòng nhập mật khẩu'
    if (password.length < 6 || password.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'
    if (!!password.match(/\s/g)) throw 'Mật khẩu không có khoảng cách'

    // Check User
    const userCheck = await DB.User
    .findOne({ 
      $or: [
        { username: username },
        { phone: phone },
        { email: email }
      ]
    })
    .select('username email phone') as IDBUser
    
    if(!!userCheck){
      if(userCheck.username == username) throw 'Tài khoản đã tồn tại'
      if(userCheck.phone == phone) throw 'Số điện thoại đã tồn tại'
      if(userCheck.email == email) throw 'Địa chỉ Email đã tồn tại'
    }

    // Create
    const user = await DB.User.create({
      username: username,
      password: md5(password),
      phone: phone,
      email: email
    }) as IDBUser

    // Update Ads From
    const adsFromCode = getCookie(event, 'ads-from')
    if(!!adsFromCode){
      const adsFromData = await DB.AdsFrom.findOne({ code: adsFromCode }).select('_id') as IDBAdsFrom
      if(!!adsFromData){
        await DB.AdsFrom.updateOne({ _id: adsFromData._id }, { $inc: { 'sign.up': 1 }})
        user.reg.from = adsFromData._id
      }
      else deleteCookie(event, 'ads-from', runtimeConfig.public.cookieConfig)
    }

    // Update Reg Collab
    const collabCode = getCookie(event, 'collab')
    if(!!collabCode){
      const collab = await DB.Collab.findOne({ code: collabCode }).select('_id')
      if(!!collab) user.reg.collab = collab._id
      else deleteCookie(event, 'collab', runtimeConfig.public.cookieConfig)
    }

    // Make Token And Cookie
    const token = jwt.sign({
      _id : user._id
    }, runtimeConfig.apiSecret, { expiresIn: '360d' })
    setCookie(event, 'token-auth', token, runtimeConfig.public.cookieConfig)
    user.token = token
    await user.save()

    // Save IP
    const IP = getRequestIP(event, { xForwardedFor: true })
    await DB.UserIP.create({ user: user._id, ip: IP })

    // Send Notify and Save Log
    logUser({
      user: user._id,
      action: `Đăng ký tài khoản`,
      type: 'signup'
    })

    await sendNotifyUser({
      user: user._id,
      color: 'primary',
      content: `Chào mừng thành viên mới, chúc bạn chơi game vui vẻ`
    })
    
    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})