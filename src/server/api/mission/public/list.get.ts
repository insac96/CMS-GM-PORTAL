
export default defineEventHandler(async (event) => {
  try {
    const list = await DB.Mission.find({ display: true })
    const newList = []
    
    for (let i = 0; i < list.length; i++) {
      const item = JSON.parse(JSON.stringify(list[i]))
      item.status = await getMissionActive(event, list[i])
      newList.push(item)
    }
    
    return resp(event, { result: newList })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})