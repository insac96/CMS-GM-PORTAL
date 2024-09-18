import { IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const config = await DB.Config
    .findOne()
    .select(`
      -manage_password
      -about -privacy -terms 
      -telebot
      -facebook.client_secret 
      -zalo.client_secret 
      -tiktok.client_secret
      -google.client_secret
    `) as IDBConfig

    if(!config) throw 'Không tìm thấy cấu hình trang'
    if(!!config.license) throw 'Trang không chính thống'

    return resp(event, { result: config })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})