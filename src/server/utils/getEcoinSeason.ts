import type { H3Event } from 'h3'
import type { IDBEcoinSeason } from '~~/types'

export default async (event : H3Event) : Promise<any> => {
  const season = await DB.EcoinSeason.findOne({ active: true }) as IDBEcoinSeason
  if(!season) throw 'Chưa có mùa giải nào đang khởi chạy'

  const now = formatDate(event)
  const start = formatDate(event, season.time.start)
  const end = formatDate(event, season.time.end)
  if(now.timestamp < start.timestamp) throw 'Mùa giải chưa bắt đầu'
  if(now.timestamp > end.timestamp) throw 'Mùa giải đã kết thúc'

  const users = await DB.User.aggregate([
    { $match: { 'currency.ecoin': { $gt: 0 } }},
    { $group: {
      _id: null,
      ecoin: { $sum: '$currency.ecoin' }
    }}
  ])

  const result = JSON.parse(JSON.stringify(season)) as IDBEcoinSeason
  result.farming = users[0] ? users[0].ecoin : 0

  const totalEcoin = Number(result.ecoin || 0) + Number(result.farming || 0)
  if(totalEcoin <= 0) throw 'Thông số mùa giải không chính xác'
  result.price = Math.round((Number(result.vnd) / Number(totalEcoin)) * 100) / 100

  return Promise.resolve(result)
}