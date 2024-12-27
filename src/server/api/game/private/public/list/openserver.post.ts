import type { IDBCollab, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'

    const match : any = { }
    const collabCode = getCookie(event, 'collab')
    if(!!collabCode){
      const collab = await DB.Collab.findOne({ code: collabCode }).select('_id') as IDBCollab
      if(!!collab){
        const list = await DB.GamePrivate.find({ '$expr': { '$in': [ collab._id, '$collab.use' ]} }).select('_id')
        match['game'] = { $in: list.map((item: IDBGamePrivate) => item._id) }
      }
    }

    const list = await DB.GamePrivateServerOpen
    .find(match)
    .populate({ path: 'game', select: 'name key code image.icon' })
    .sort({ opentime: -1 })
    .limit(size)
    .skip((current - 1) * size)

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})