import { type H3Event } from 'h3'
import type { Types } from 'mongoose'
import { IDBCollab, IDBCollabLevel, IDBUser } from '~~/types'

interface IData {
  type: string
  collab?: Types.ObjectId
  user: Types.ObjectId
  game?: Types.ObjectId
  source?: Types.ObjectId
  content: string
  server?: string
  role?: string
  coin: number
  money?: number
  commission: {
    game?: number
    level?: number
  }
}

export default async (event: H3Event, data : IData) : Promise<boolean> => {
  try {
    const user = await DB.User.findOne({ _id: data.user }).select('reg') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(!user.reg.collab) throw 'Tài khoản không có nguồn cộng tác viên'

    const collab = await DB.Collab.findOne({ _id: user.reg.collab }).select('level') as IDBCollab
    if(!collab) throw 'Không tìm thấy thông tin cộng tác viên'

    const level = await DB.CollabLevel.findOne({ _id: collab.level }) as IDBCollabLevel
    if(!level) throw 'Không tìm thấy thông tin cấp độ cộng tác viên'

    const result = JSON.parse(JSON.stringify(data)) as IData
    result.user = user._id
    result.collab = collab._id

    // Make Commission
    if(data.type.includes("vip")) result.commission.level = level.commission.vip
    else if(data.type.includes("game.private")) result.commission.level = level.commission.game.private
    else if(data.type.includes("game.tool")) result.commission.level = level.commission.game.tool
    else if(data.type.includes("game.china")) result.commission.level = level.commission.game.china
    else result.commission.level = 0
    result.commission.game = !!data.commission.game ? data.commission.game : 0

    // Make Money
    const commissionTotal = result.commission.level + result.commission.game
    result.money = Math.floor((parseInt(String(result.coin)) * commissionTotal) / 100)

    // Create Income
    await DB.CollabIncome.create(result)
    await DB.Collab.updateOne({ _id: collab._id }, { $inc: { 'money': result.money }})
    return Promise.resolve(true)
  }
  catch(e){
    return Promise.resolve(false)
  }
}