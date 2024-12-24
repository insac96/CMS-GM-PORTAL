import { IAuth, IDBAdsCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { code } = await readBody(event)
    if(!code) throw true

    const adsCollab = await DB.AdsCollab.findOne({ code: code }).select('code user') as IDBAdsCollab
    if(!adsCollab) throw true
    if(auth.type < 100 && adsCollab.user.toString() != auth._id.toString()) throw true
      
    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { result: false })
  }
})