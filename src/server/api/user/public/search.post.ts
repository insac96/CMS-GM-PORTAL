export default defineEventHandler(async (event) => {
  try {
    const { key, type } = await readBody(event)

    const match : any = { username : { $regex : key.toLowerCase(), $options : 'i' }}
    if(!!type) match['type'] = type

    const users = await DB.User.find(match).select('username').limit(10)

    return resp(event, { result: users })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})