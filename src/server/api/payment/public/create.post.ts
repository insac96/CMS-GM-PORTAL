import md5 from "md5"
import type { IAuth, IDBConfig, IDBGate, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    // Check Body
    const body = await readBody(event)
    const { gate, card, money } = body
    if(!gate || !card) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(money)) || parseInt(money) < 1) throw 'Số tiền không hợp lệ'
    if(parseInt(money) < 20000) throw 'Số tiền phải lớn hơn hoặc bằng 20.000đ'
    if(parseInt(money) % 10000 != 0) return 'Số tiền phải là bội số của 10.000'
    if(parseInt(money) > 50000000) throw 'Số tiền nhập vào quá lớn'

    // Config
    const config = await DB.Config.findOne({}).select('short_name telebot manage_password') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'

    // Check User
    const user = await DB.User.findOne({ _id: auth._id }).select('username') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    // Check Gate
    const gateSelect = await DB.Gate
    .findOne({ _id: gate })
    .select('name number person type key qrcode callback display') as IDBGate
    if(!gateSelect) throw 'Kênh nạp không tồn tại'
    if(!gateSelect.display) throw 'Kênh nạp đang bảo trì'

    // Make Code, Token
    const countPayment = await DB.Payment.count()
    const prefix = config.short_name ? config.short_name.trim().toUpperCase() : 'PAY'
    const code = prefix + (countPayment > 9 ? countPayment : `0${countPayment}`) + Math.floor(Math.random() * (99 - 10) + 10)
    const token = md5(`${code}-${Date.now()}`)
    
    // Make QR
    let qrcode
    if(!!gateSelect.qrcode && gateSelect.type != 1){
      qrcode = gateSelect.qrcode
      qrcode = qrcode.replaceAll('[money]', String(parseInt(money)))
      qrcode = qrcode.replaceAll('[code]', code)
      qrcode = qrcode.replaceAll('[token]', token)
      qrcode = qrcode.replaceAll('[gate-name]', gateSelect.name)
      qrcode = qrcode.replaceAll('[gate-number]', gateSelect.number)
      qrcode = qrcode.replaceAll('[gate-person]', gateSelect.person)
    }

    // Check Card
    if(gateSelect.type == 1){
      if(!gateSelect.key) throw 'Kênh thẻ cào đang bảo trì'
      if(!card.net || !card.seri || !card.pin) throw 'Thông tin thẻ cào không hợp lệ'

      await checkCard(event, {
        net: card.net,
        seri: card.seri,
        pin: card.pin,
        money: parseInt(money),
        token: token,
        key: gateSelect.key
      })
    }

    // Create
    const payment = await DB.Payment.create({
      user: auth._id,
      gate: gateSelect._id,
      card: card,
      money: parseInt(money),
      code: code,
      token: token,
      qrcode: qrcode
    })

    // Telebot
    const timeFormat = formatDate(event, new Date())
    const gateReceive : string = gate.type == 1 ? 'Thẻ Cào' : `${gateSelect.name} - ${gateSelect.person} - ${gateSelect.number}`

    await botTeleSendMessage(event, {
      url: config.telebot.payment.create,
      secret: config.manage_password,
      message: `
        Giao dịch nạp tiền mới
        » Tài khoản: ${user.username}
        » Mã giao dịch: ${payment.code}
        » Số tiền: ${money.toLocaleString('vi-VN')}
        » Thời gian: ${timeFormat.day}/${timeFormat.month}/${timeFormat.year} - ${timeFormat.hour}:${timeFormat.minute}
        » Kênh nạp: ${gateReceive}
      `
    })

    return resp(event, { message: 'Tạo giao dịch thành công', result: {
      code: code,
      qrcode: qrcode
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
