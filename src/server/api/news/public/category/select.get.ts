export default defineEventHandler(async (event) => {
  try {
    const categories = await DB.NewsCategory.find().select('name key')
    return resp(event, { result: categories })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})