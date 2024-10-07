import type { H3Event } from 'h3'
import type { IAuth, IDBGamePrivateEvent, IDBGamePrivateEventHistory, IDBGamePrivateUser } from '~~/types'

const typeCheck : any = {
  'login.week' : 'week',
  'login.month' : 'month',

  'pay.day.coin' : 'day',
  'pay.week.coin' : 'week',
  'pay.month.coin' : 'month',

  'spend.day.gcoin': 'day', 
  'spend.week.gcoin': 'week', 
  'spend.month.gcoin': 'month',

  'pay.musty': 'day', 
}

export default async (event: H3Event, eventData : IDBGamePrivateEvent, type : string) : Promise<any> => {
  try {
    const auth = event.context.auth as IAuth
    if(!auth) return Promise.resolve(-3) // Chưa đăng nhập

    let check : any
    const userGame = await DB.GamePrivateUser.findOne({ user: auth._id, game: eventData.game }).select(`${type}`) as IDBGamePrivateUser
    if(!userGame) return Promise.resolve(-2) // Chưa đăng ký chơi

    // Đơn Nạp
    if(type == 'pay.musty'){
      check = userGame.pay.musty.find((i:any) => i == eventData.need)
      if(!check) return Promise.resolve(-1) // Chưa đạt
    }
    // Liên Nạp
    else if(type == 'pay.running'){
      const { day, receive } = userGame.pay.running
      if(day < eventData.need) return Promise.resolve(-1) // Chưa đạt
      if(receive >= eventData.need) return Promise.resolve(1) // Đã nhận
      return Promise.resolve(0) // Có thể nhận
    }
    // Other
    else {
      const typeArray = type.split('.')
      typeArray.forEach((i : string) => {
        // @ts-expect-error
        if(!check) check = userGame[i]
        else check = check[i]
      })
      if(eventData.need > check) return Promise.resolve(-1) // Chưa đạt
    }

    const history = await DB.GamePrivateEventHistory
    .findOne({ user: userGame._id, event: eventData._id })
    .select('createdAt')
    .sort({ createdAt: -1 })
    .limit(1) as IDBGamePrivateEventHistory

    if(!history) return Promise.resolve(0) // Có thể nhận
    if(!typeCheck[type]){
      if(!!history) return Promise.resolve(1) // Đã nhận
    }
    else {
      const historyTime = formatDate(event, history.createdAt)
      const nowTime = formatDate(event)

      if(typeCheck[type] == 'day'){
        if(
          historyTime.day == nowTime.day 
          && historyTime.month == nowTime.month 
          && historyTime.year == nowTime.year
        ) return Promise.resolve(1) // Đã nhận 

        return Promise.resolve(0) // Có thể nhận
      }

      if(typeCheck[type] == 'week'){
        if(
          historyTime.week == nowTime.week 
          && historyTime.month == nowTime.month 
          && historyTime.year == nowTime.year
        ) return Promise.resolve(1) // Đã nhận 

        return Promise.resolve(0) // Có thể nhận
      }

      if(typeCheck[type] == 'month'){
        if(
          historyTime.month == nowTime.month 
          && historyTime.year == nowTime.year
        ) return Promise.resolve(1) // Đã nhận 

        return Promise.resolve(0) // Có thể nhận
      }
    }
  }
  catch (e:any) {
    return Promise.resolve(99) // Lỗi không xác định
  }
}