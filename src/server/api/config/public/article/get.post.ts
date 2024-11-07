import type { IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event)
    const { type } = data
    if(!type) throw 'Không tìm thấy kiểu bài viết'
    
    const config = await DB.Config.findOne().select(`article.${type}`) as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'
    
    // @ts-expect-error
    return resp(event, { result: config.article[`${type}`] })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})