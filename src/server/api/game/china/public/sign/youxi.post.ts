import type { IAuth, IDBUser } from "~~/types"
import md5 from "md5"
import axios from "axios"

export default defineEventHandler(async (event) => {
  try {
      const auth = await getAuth(event) as IAuth
      const { password } = await readBody(event)
      if(!password) throw 'Vui lòng nhập mật khẩu'

      const user = await DB.User.findOne({ _id: auth._id }).select('password china') as IDBUser
      if(md5(password) != user.password) throw 'Mật khẩu không chính xác'

      const url = 'http://api.sy12306.com/oauth/mrkendyUserReg'
      const send : any = {
        'app_id': 100,
        'client_id': 520809,
        'format': 'json',
        'mem-password': password,
        'mem-username': auth.username,
        'key': 'czum4yx94la8ssqeo6o17k3whvxb0wu7'
      }
      const sendStr = new URLSearchParams(send).toString()
      const sign = md5(sendStr)
      send.sign = sign
      delete send['key']

      const result = await axios.post(url, send)
      const data = result.data
      if(data.code != 200 && data.code != 41103) throw 'Khởi tạo tài khoản Trung không thành công'

      user.china.youxi = true
      await user.save()

      logUser({
        user: user._id,
        action: 'Đăng ký tài khoản chơi Game China',
        type: 'game.china.sign'
      })
      
      return resp(event, { code: 200, result: true })
  }
  catch(e : any){
    return resp(event, { code: 400, message: e.toString() })
  }
})