import type { H3Event } from 'h3'
import type { IAuth, IDBMission, IDBMissionHistory } from '~~/types'

export default async (event: H3Event, mission : IDBMission) : Promise<any> => {
  try {
    const auth = await getAuth(event, false) as IAuth
    if(!auth) return Promise.resolve(-1) // Chưa đăng nhập

    const history = await DB.MissionHistory
    .findOne({ user: auth._id, mission: mission._id })
    .select('createdAt')
    .sort({ createdAt: -1 })
    .limit(1) as IDBMissionHistory

    if(!history) return Promise.resolve(0) // Cần check
    if(!!mission.daily){
      const historyTime = formatDate(event, history.createdAt)
      const nowTime = formatDate(event)
      if(
        historyTime.day == nowTime.day 
        && historyTime.month == nowTime.month 
        && historyTime.year == nowTime.year
      ) return Promise.resolve(1) // Đã nhận 

      return Promise.resolve(0) // Cần check
    }
    
    return Promise.resolve(1) // Đã nhận
  }
  catch (e:any) {
    return Promise.resolve(99) // Lỗi không xác định
  }
}