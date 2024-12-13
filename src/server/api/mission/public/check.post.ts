import { Types } from "mongoose"
import type { IAuth, IDBGameChina, IDBGamePrivate, IDBGameTool, IDBLogUser, IDBMission, IDBMissionHistory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { mission: _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const mission = await DB.Mission.findOne({ _id: _id, display: true }) as IDBMission
    if(!mission) throw 'Nhiệm vụ không tồn tại'

    const active = await getMissionActive(event, mission)
    if(active == 99) throw 'Nhiệm vụ lỗi, vui lòng quay lại sau'
    if(active == 1) throw 'Bạn đã nhận thưởng nhiệm vụ này rồi'

    let canReceive : boolean = false

    // Nhiệm vụ 1 lần duy nhất
    if(!!['pay.first', 'vip.upgrade'].includes(mission.type)){
      const log = await DB.LogUser.findOne({ user: auth._id, type: mission.type }) as IDBLogUser
      if(!!log) canReceive = true
      else canReceive = false
    }

    // Nhiệm vụ nạp tiền
    else if(mission.type == 'pay.success'){
      if(!!mission.daily){
        const start : any = DayJS().startOf('date')
        const end : any = DayJS().endOf('date')

        const log = await DB.LogUser.aggregate([
          { $match: { user: auth._id, type: mission.type }},
          { $project: { 
            createdAt: 1, target: 1,
            timeformat: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }}
          }},
          { $group: { 
            _id: '$timeformat',
            time: { $min: '$createdAt' },
            need: { $sum: { $toInt: "$target" }}
          }},
          { $match: {
            time: { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }
          }},
        ])

        if(!log[0]) canReceive = false
        if((log[0].need as number) < Number(mission.need)) canReceive = false
        else canReceive = true
      }
      else {
        const log = await DB.LogUser.aggregate([
          { $match: { user: auth._id, type: mission.type }},
          { $project: { target: 1 }},
          { $group: { _id: null, need: { $sum: { $toInt: "$target" }} }}
        ])

        if(!log[0]) canReceive = false
        if((log[0].need as number) < Number(mission.need)) canReceive = false
        else canReceive = true
      }
    }

    // Nhiệm vụ Game
    else {
      const log = await DB.LogUser
      .findOne({ user: auth._id, type: mission.type, target: mission.need })
      .select('createdAt')
      .sort({ createdAt: -1 })
      .limit(1) as IDBLogUser

      if(!log) canReceive = false
      else {
        if(!!mission.daily){
          const logTime = formatDate(event, log.createdAt)
          const nowTime = formatDate(event)
          if(logTime.day == nowTime.day  && logTime.month == nowTime.month && logTime.year == nowTime.year) canReceive = true
          else canReceive = false
        }
        else canReceive = true
      }
    }

    if(!canReceive) throw 'Bạn chưa đủ điều kiện nhận thưởng'

    const giftCurrency : any = {}
    for (const [key, value] of Object.entries(mission.gift)) {
      if(value > 0){
        giftCurrency[`currency.${key}`] = value
      }
    }
    if(Object.keys(giftCurrency).length == 0) throw 'Nhiệm vụ chưa có phần thưởng, vui lòng quay lại sau'
    await DB.User.updateOne({ _id: auth._id }, { $inc: giftCurrency })
    await DB.MissionHistory.create({ user: auth._id, mission: mission._id })
    await logUser({
      user: auth._id,
      type: 'mission.receive',
      action: `Nhận thưởng nhiệm vụ <b>${mission.title}</b>`
    })

    return resp(event, { result: 1, message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})