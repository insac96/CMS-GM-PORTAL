export default defineEventHandler(async (event) => {
  try {
    const list = await DB.CollabLevel.find().select('number')
    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})