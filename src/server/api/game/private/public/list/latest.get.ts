export default defineEventHandler(async (event) => {
  try {
    const match : any = { display: true }
    const list = await DB.GamePrivate
    .find(match)
    .select('name code key pin statistic description image.banner image.icon')
    .populate({ path: 'platform', select: 'name' })
    .populate({ path: 'category', select: 'name' })
    .sort({ 'statistic.user': -1, 'statistic.view': -1, 'statistic.play': -1 })
    .limit(4)

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})