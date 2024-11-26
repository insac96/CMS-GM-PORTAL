export default defineEventHandler(async (event) => {
  try {
    const list = await DB.SocketChatGlobal
    .find({})
    .populate({ path: 'user', select: 'username avatar type level vip', populate: { path: 'level' }})
    .sort({ createdAt: -1 })
    .limit(10)

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})