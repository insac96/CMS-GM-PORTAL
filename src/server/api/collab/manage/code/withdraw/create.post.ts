import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { money, bank, collab : code } = body
    if(!money || !bank) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!bank.name || !bank.number || !bank.person) throw 'Dữ liệu ngân hàng không hợp lệ'
    if(!!isNaN(parseInt(money))) throw 'Số tiền rút không hợp lệ'
    if(parseInt(money) < 100000) throw 'Số tiền rút tối thiểu 100.000'
    if(!code) throw 'Dữ liệu đầu vào không đủ'
        
    const collab = await DB.Collab.findOne({ code: code }) as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'
    if(parseInt(money) > collab.money) throw 'Số dư không đủ để thực hiện'

    const count = await DB.CollabWithdraw.count({ collab: collab._id })
    const prefix = collab.code
    const codeWithdraw = prefix + "-" + (count > 9 ? count : `0${count}`)

    await DB.CollabWithdraw.create({
      collab: collab._id,
      user: auth._id,
      code: codeWithdraw,
      money: money,
      bank: bank
    })

    await DB.Collab.updateOne({ _id: collab._id }, { $inc: { 'money': parseInt(money) * -1 }})

    return resp(event, { message: 'Tạo lệnh thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})