export default defineEventHandler(async (event) => {
  try {
    const categories = await DB.GameCategory.find().select('name icon key')
    return resp(event, { result: categories })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})