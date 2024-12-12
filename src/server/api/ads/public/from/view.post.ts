import { IDBAdsFrom } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { code } = await readBody(event)
    if(!code) throw true

    const adsFromData = await DB.AdsFrom.findOne({ code: code }).select('_id') as IDBAdsFrom
    if(!adsFromData) throw true
      
    await DB.AdsFrom.updateOne({ _id: adsFromData._id }, { $inc: { 'view': 1 }})
    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { result: false })
  }
})