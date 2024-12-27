import type { IAuth, IDBCollab } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { size, current, sort, range, collab : code } = await readBody(event)
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!code) throw 'Dữ liệu đầu vào không đủ'

    const collab = await DB.Collab.findOne({ code: code }).select('code user') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'
    
    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(!!range && !!range['start'] && !!range['end']){
      const start : any = DayJS(range['start']).startOf('date')
      const end : any = DayJS(range['end']).endOf('date')
      match['time'] = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }
    }

    const payment = await DB.Payment.aggregate([
      {
        $lookup: {
          from: "User",
          localField: "user",
          foreignField: "_id",
          pipeline: [{
            $project: { reg: 1 }
          }],
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true }},
      { $match: { 'user.reg.collab': collab._id } },
      {
        $lookup: {
          from: "Gate",
          localField: "gate",
          foreignField: "_id",
          pipeline: [{
            $project: { type: 1 }
          }],
          as: "gate"
        }
      },
      { $unwind: { path: "$gate" }},
      {
        $project: {
          createdAt: 1,
          timeformat: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
          },
          count: {
            waiting: { $cond: [{$eq: ['$status', 0]} , 1, 0] },
            success: { $cond: [{$eq: ['$status', 1]} , 1, 0] },
            refuse: { $cond: [{$eq: ['$status', 2]} , 1, 0] },
          },
          money: {
            total: { $cond: [{$eq: ['$status', 1]} , '$money', 0] },
            card: { $cond: [
              { $and: [
                { $eq: ['$gate.type', 1] },
                { $eq: ['$status', 1] } 
              ]}, 
              '$money', 0
            ]},
            bank: { $cond: [
              { $and: [
                { $eq: ['$gate.type', 2] },
                { $eq: ['$status', 1] } 
              ]}, 
              '$money', 0
            ]},
            momo: { $cond: [
              { $and: [
                { $eq: ['$gate.type', 3] },
                { $eq: ['$status', 1] } 
              ]}, 
              '$money', 0
            ]},
          }
        }
      },
      {
        $group: {
          _id: '$timeformat',
          time: { $min: '$createdAt' },
          count_total: { $sum: 1 },
          count_waiting: { $sum: '$count.waiting' },
          count_success: { $sum: '$count.success' },
          count_refuse: { $sum: '$count.refuse' },
          money_total: { $sum: '$money.total' },
          money_card: { $sum: '$money.card' },
          money_bank: { $sum: '$money.bank' },
          money_momo: { $sum: '$money.momo' },
        }
      },
      { $match: match },
      {
        $facet: {
          list: [
            { $sort: sorting },
            { $skip: (current - 1) * size },
            { $limit: size },
          ],
          pagination: [
            { $count: "total" }
          ]
        }
      }
    ])

    return resp(event, { result: { 
      list: payment[0].list ? payment[0].list : [],
      total: payment[0].pagination ? (payment[0].pagination[0] ? payment[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})