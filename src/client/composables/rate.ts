interface IData {
  default: any
  limit: {
    number: any
    expired: Date
  }
}

export const useRate = () => {
  const data = (data : IData) => {
    let number = 0
    let time : any = ''
    const defaultRate = parseInt(data.default || 0)
    const limitRate = parseInt(data.limit.number || 0)
    const limitExpired = data.limit.expired || null

    if(!limitExpired) number = defaultRate, time = null
    else {
      const { dayjs, displayFull } = useDayJs()
      const nowTime = dayjs(Date.now()).unix()
      const expiredTime = dayjs(limitExpired).unix()
      if(nowTime < expiredTime) number = limitRate, time = `đến ${displayFull(limitExpired)}`
      else number = defaultRate, time = null
    }

    return { number, time }
  }

  return { data }
}