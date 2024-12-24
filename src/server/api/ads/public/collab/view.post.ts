import { IDBAdsCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { code } = await readBody(event)
    if(!code) throw true

    const adsCollab = await DB.AdsCollab.findOne({ code: code }).select('_id') as IDBAdsCollab
    if(!adsCollab) throw true
      
    await DB.AdsCollab.updateOne({ _id: adsCollab._id }, { $inc: { 'view': 1 }})
    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { result: false })
  }
})