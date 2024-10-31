import type { IDBUser } from "~~/types"

export default async (user: IDBUser) : Promise<any> => {
  if(!user.vip) return null
  if(!!user.vip.forever.enable) return 'forever'
  else 
    if(!!user.vip.month.enable){
      const end = DayJS(user.vip.month.end).unix()
      const now = DayJS(Date.now()).unix()
      if(end < now) return null
      return 'month'
    }
    else return null
}