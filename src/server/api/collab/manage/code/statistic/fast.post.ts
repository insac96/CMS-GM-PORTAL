import type { IAuth, IDBCollab } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { type, collab : code } = await readBody(event)
    if(!type || !code) throw 'Dữ liệu đầu vào không đủ'

    const collab = await DB.Collab.findOne({ code: code }).select('code user') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    let start : any, end : any, format : any
    let payment : any, signin : any, signup : any, spend : any
    const now = DayJS(Date.now())
    const yesterday = now.add(-1, 'day')
    const lastmonth = now.add(-1, 'month')

    // Today, Yesterday
    if(type == 'today' || type == 'yesterday'){
      if(type == 'today'){
        start = now.startOf('date')
        end = now.endOf('date')
      }
      if(type == 'yesterday'){
        start = yesterday.startOf('date')
        end = yesterday.endOf('date')
      }

      format = '%Y-%m-%d'
    }

    // This Month, Last Month
    if(type == 'month' || type == 'lastmonth'){
      if(type == 'month'){
        start = now.startOf('month')
        end = now.endOf('month')
      }
      if(type == 'lastmonth'){
        start = lastmonth.startOf('month')
        end = lastmonth.endOf('month')
      }
      
      format = '%Y-%m'
    }

    // Not Total
    if(type != 'total'){
      const match : any = {}
      match['time'] = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }

      payment = await DB.Payment.aggregate([
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
          $project: {
            createdAt: 1,
            timeformat: {
              $dateToString: { format: format, date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
            },
            money: {
              total: { $cond: [{$eq: ['$status', 1]} , '$money', 0] },
            }
          }
        },
        {
          $group: {
            _id: '$timeformat',
            time: { $min: '$createdAt' },
            money: { $sum: '$money.total' },
          }
        },
        { $match: match }
      ])

      signin = await DB.LogLogin.aggregate([
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
          $project: {
            user: 1,
            createdAt: 1,
            timeformat: {
              $dateToString: { format: format, date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
            }
          }
        },
        {
          $group: {
            _id: {
              timeformat: '$timeformat',
              user: '$user._id'
            },
            time: { $min: '$createdAt' },
          }
        },
        { $match: match },
        {
          $group: {
            _id: '$_id.timeformat',
            time: { $min: '$time' },
            count: { $count: {} },
          }
        }
      ])
  
      signup = await DB.User.aggregate([
        { $match: { 'reg.collab': collab._id } },
        {
          $project: {
            createdAt: 1,
            timeformat: {
              $dateToString: { format: format, date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
            }
          }
        },
        {
          $group: {
            _id: '$timeformat',
            time: { $min: '$createdAt' },
            count: { $count: {} },
          }
        },
        { $match: match }
      ])
    }

    // Is Total
    if(type == 'total') {
      payment = await DB.Payment.aggregate([
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
        { $match: { 'status': 1, 'user.reg.collab': collab._id } },
        {
          $group: {
            _id: null,
            money: { $sum: '$money' },
          }
        }
      ])

      const users = await DB.User.count({ 'reg.collab': collab._id })
      signin = [{ count: users }]
      signup = [{ count: users }]
    }

    // Result
    return resp(event, {
      result: {
        payment: payment[0] ? payment[0]['money'] : 0,
        signin: signin[0] ? signin[0]['count'] : 0,
        signup: signup[0] ? signup[0]['count'] : 0,
      }
    })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})