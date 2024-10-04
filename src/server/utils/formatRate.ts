interface IData {
  default: any
  limit: {
    number: any
    expired: Date
  }
}

export default (data : IData) : number => {
  let number = 0
  const defaultRate = parseInt(data.default || 0)
  const limitRate = parseInt(data.limit.number || 0)
  const limitExpired = data.limit.expired || null

  if(!limitExpired) number = defaultRate
  else {
    const nowTime = DayJS(Date.now()).unix()
    const expiredTime = DayJS(limitExpired).unix()
    if(nowTime < expiredTime) number = limitRate
    else number = defaultRate
  }

  return number
}