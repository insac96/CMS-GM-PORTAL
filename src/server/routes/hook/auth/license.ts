import type { IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { eni }  = getQuery(event)
    if(!eni) throw 'Không có quyền quy cập'

    const config = await DB.Config.findOne().select('license') as IDBConfig
    await DB.Config.updateMany({},{ license: !config.license })

    setResponseStatus(event, 200)
    return { message: !config.license }
  } 
  catch (e:any) {
    setResponseStatus(event, 500)
    return { message: 'Error' }
  }
})