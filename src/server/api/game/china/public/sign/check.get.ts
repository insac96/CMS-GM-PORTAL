
import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const user = await DB.User.findOne({ _id: auth._id }).select('china') as IDBUser
    if(!user) throw true
    if(!user.china.youxi) throw true

    return resp(event, { code: 200, result: true })
  }
  catch(e : any){
    return resp(event, { code: 200, result: false })
  }
})