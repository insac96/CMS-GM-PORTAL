import type { H3Event } from 'h3'
import type { IAuth, IDBGamePrivateEvent, IDBGamePrivateEventHistory, IDBGamePrivateUser } from '~~/types'

const typeCheck : any = {
  'login.week' : 'week',
  'login.month' : 'month',
  'spend.day.coin': 'day', 
  'spend.week.coin': 'week', 
  'spend.month.coin': 'month',
}

export default async (event: H3Event, eventData : IDBGamePrivateEvent, type : string) : Promise<any> => {
  try {
    const auth = await getAuth(event, false) as IAuth
    if(!auth) return Promise.resolve(-3) // Chưa đăng nhập

    let check : any
    const userGame = await DB.GamePrivateUser.findOne({ user: auth._id, game: eventData.game }).select(`${type}`) as IDBGamePrivateUser
    if(!userGame) return Promise.resolve(-2) // Chưa đăng ký chơi

    const typeArray = type.split('.')
    typeArray.forEach((i : string) => {
      // @ts-expect-error
      if(!check) check = userGame[i]
      else check = check[i]
    })
    if(eventData.need > check) return Promise.resolve(-1) // Chưa đạt

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