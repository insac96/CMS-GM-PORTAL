import { IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { code } = await readBody(event)
    if(!code) throw true

    const collab = await DB.Collab.findOne({ code: code }).select('_id') as IDBCollab
    if(!collab) throw true
      
    await DB.Collab.updateOne({ _id: collab._id }, { $inc: { 'view': 1 }})
    return resp(event, { result: true })
  } 
  catch (e:any) {
    const runtimeConfig = useRuntimeConfig()
    deleteCookie(event, 'collab', runtimeConfig.public.cookieConfig)
    return resp(event, { result: false })
  }
})