import { IDBGameTool } from "~~/types"

const mergeArray = (input : Array<IDBGameTool>, list : Array<IDBGameTool>) => {
  const arr = input.concat(list)

  const merge = arr.reduce((a : Array<IDBGameTool>, c : IDBGameTool) => {
    const obj = a.find((obj : IDBGameTool) => obj._id.toString() === c._id.toString())
    if(!obj) a.push(c)
    return a
  }, [])

  return merge
}

export default defineEventHandler(async (event) => {
  try {
    const { key, _id } = await readBody(event)

    const match : any = {}

    if(!!key){
      const search = formatVNString(key, '-')
      match['$or'] = [
        { 'key': { $regex : search, $options : 'i' }},
        { 'code': { $regex : search, $options : 'i' }},
      ]
    }

    let list = await DB.GameTool.find(match).select('name').limit(10) as Array<IDBGameTool>

    if(!!_id){
      const game = await DB.GameTool.findOne({ _id: _id }).select('name') as IDBGameTool
      const games = [ game ]
      list = mergeArray(list, games)
    }

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})