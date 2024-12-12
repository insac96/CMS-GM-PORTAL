import { IDBGamePrivate } from "~~/types"

const mergeArray = (input : Array<IDBGamePrivate>, list : Array<IDBGamePrivate>) => {
  const arr = input.concat(list)

  const merge = arr.reduce((a : Array<IDBGamePrivate>, c : IDBGamePrivate) => {
    const obj = a.find((obj : IDBGamePrivate) => obj._id.toString() === c._id.toString())
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

    let list = await DB.GamePrivate.find(match).select('name').limit(10) as Array<IDBGamePrivate>

    if(!!_id){
      const game = await DB.GamePrivate.findOne({ _id: _id }).select('name') as IDBGamePrivate
      const games = [ game ]
      list = mergeArray(list, games)
    }

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})