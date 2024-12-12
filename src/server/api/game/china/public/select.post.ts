import { IDBGameChina } from "~~/types"

const mergeArray = (input : Array<IDBGameChina>, list : Array<IDBGameChina>) => {
  const arr = input.concat(list)

  const merge = arr.reduce((a : Array<IDBGameChina>, c : IDBGameChina) => {
    const obj = a.find((obj : IDBGameChina) => obj._id.toString() === c._id.toString())
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

    let list = await DB.GameChina.find(match).select('name').limit(10) as Array<IDBGameChina>

    if(!!_id){
      const game = await DB.GameChina.findOne({ _id: _id }).select('name') as IDBGameChina
      const games = [ game ]
      list = mergeArray(list, games)
    }

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})