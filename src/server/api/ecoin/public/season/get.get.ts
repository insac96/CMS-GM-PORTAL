import type { IDBEcoinSeason } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const season = await DB.EcoinSeason.findOne({ active: true }) as IDBEcoinSeason
    if(!season) throw 'Chưa có mùa giải nào đang khởi chạy'

    const now = formatDate(event)
    const start = formatDate(event, season.time.start)
    const end = formatDate(event, season.time.end)
    if(now.timestamp < start.timestamp) throw 'Mùa giải chưa bắt đầu'
    if(now.timestamp > end.timestamp) throw 'Mùa giải đã bắt đầu'

    const users = await DB.User.aggregate([
      { $match: { 'currency.ecoin': { $gt: 0 } }},
      { $group: {
        _id: null,
        ecoin: { $sum: '$currency.ecoin' }
      }}
    ])

    const result = JSON.parse(JSON.stringify(season))
    result.farming = users[0] ? users[0].ecoin : 0

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})