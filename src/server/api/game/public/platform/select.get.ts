export default defineEventHandler(async (event) => {
  try {
    const platforms = await DB.GamePlatform.find().select('name icon key')
    return resp(event, { result: platforms })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})