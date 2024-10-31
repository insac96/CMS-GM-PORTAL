import type { IAuth, IDBConfig, IDBUser } from "~~/types"
const vipTypes = ['month', 'forever']

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { type } = body
    if(!type) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!vipTypes.includes(type)) throw 'Gói nâng cấp VIP không hỗ trợ'
    
    const config = await DB.Config.findOne({}).select('vip') as IDBConfig
    // @ts-expect-error
    let price = auth.type != 100 ? config.vip[type] : 0 // Admin Free

    const user = await DB.User.findOne({ _id: auth._id }).select('currency.coin vip') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(!!user.vip.forever.enable) throw 'Bạn đã nâng cấp lên đặc quyền VIP Trọn Đời, không thể nâng cấp thêm'
    if(user.currency.coin < price) throw 'Số dư Xu không đủ'

    if(type == 'forever'){
      user.vip.month.enable = false
      user.vip.month.end = null
      user.vip.forever.enable = true
    }

    if(type == 'month'){
      const now = DayJS(!!user.vip.month.end ? new Date(user.vip.month.end) : Date.now())
      const end = now.add(30, 'day')
      user.vip.month.enable = true
      user.vip.month.end = end
    }
    await user.save()
    await DB.User.updateOne({ _id: user._id }, { $inc: { 'currency.coin': price * -1 }})

    return resp(event, { message: 'Nâng cấp thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})