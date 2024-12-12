import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id, type, plus, origin, reason } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
    if(type != 'plus' && type != 'origin') throw 'Kiểu chỉnh sửa không hợp lệ'
    if(!reason) throw 'Vui lòng nhập lý do'

    const user = await DB.User.findOne({_id: _id}).select('username type currency') as IDBUser
    if(!user) throw 'Người dùng không tồn tại'

    if(type == 'plus'){
      if(!!isNaN(parseInt(plus.coin))) throw 'Dữ liệu tiền tệ không hợp lệ'
      if(!!isNaN(parseInt(plus.exp))) throw 'Dữ liệu tiền tệ không hợp lệ'

      const update : any = {}
      update['$inc'] = { 
        'currency.coin': parseInt(plus.coin),
        'currency.exp': parseInt(plus.exp),
      }

      const change = []
      if(parseInt(plus.coin) > 0){
        change.push(`${plus.coin.toLocaleString('vi-VN')} xu`)
      }
      if(parseInt(plus.exp) > 0){
        change.push(`${plus.exp.toLocaleString('vi-VN')} tu vi`)
      }

      if(change.length > 0){
        const userUpdate = await DB.User.findOneAndUpdate({ _id: _id }, update, { new: true }).select('currency') as IDBUser
        if(userUpdate.currency.coin < 0) userUpdate.currency.coin = 0
        if(userUpdate.currency.exp < 0) userUpdate.currency.exp = 0
        await userUpdate.save()

        const notify = `Nhận <b>${change.join(', ')}</b> từ quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`
        logUser({ 
          user: user._id, 
          action: notify, 
          type: 'gm.receive.currency'
        })
        await sendNotifyUser({ user: user._id, content: notify})

        logAdmin(event, `Thêm <b>${change.join(', ')}</b> cho tài khoản <b>${user.username}</b> với lý do <b>${reason}</b>`)
      }
    }

    if(type == 'origin'){
      if(!!isNaN(parseInt(origin.coin)) || parseInt(origin.coin) < 0) throw 'Dữ liệu tiền tệ không hợp lệ'
      if(!!isNaN(parseInt(origin.exp)) || parseInt(origin.exp) < 0) throw 'Dữ liệu tiền tệ không hợp lệ'

      const update : any = {}
      update['currency'] = origin
      
      const change = []
      if(origin.coin != user.currency.coin){
        change.push('Xu')

        const notify = `Số <b>Xu</b> được thay đổi từ <b>${user.currency.coin.toLocaleString('vi-VN')}</b> thành <b>${origin.coin.toLocaleString('vi-VN')}</b> bởi quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`
        logUser({ 
          user: user._id, 
          action: notify, 
          type: 'gm.change.currency.coin'
        })
        await sendNotifyUser({ user: user._id, content: notify })
      }
      if(origin.exp != user.currency.exp){
        change.push('Tu Vi')

        const notify = `Số <b>Tu Vi</b> được thay đổi từ <b>${user.currency.exp.toLocaleString('vi-VN')}</b> thành <b>${origin.exp.toLocaleString('vi-VN')}</b> bởi quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`
        logUser({ 
          user: user._id, 
          action: notify, 
          type: 'gm.change.currency.exp'
        })
        await sendNotifyUser({ user: user._id, content: notify })
      }

      if(change.length > 0){
        const userUpdate = await DB.User.findOneAndUpdate({ _id: _id }, update, { new: true }).select('currency') as IDBUser
        if(userUpdate.currency.coin < 0) userUpdate.currency.coin = 0
        if(userUpdate.currency.exp < 0) userUpdate.currency.exp = 0
        await userUpdate.save()

        logAdmin(event, `Sửa dữ liệu <b>${change.join(', ')}</b> của tài khoản <b>${user.username}</b> với lý do <b>${reason}</b>`)
      }
    }

    return resp(event, { message: 'Sửa tiền tệ thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})