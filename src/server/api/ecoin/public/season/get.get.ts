export default defineEventHandler(async (event) => {
  try {
    const season = await getEcoinSeason(event)

    return resp(event, { result: season })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})