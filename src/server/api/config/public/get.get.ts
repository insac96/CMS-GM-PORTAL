import { IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const config = await DB.Config
    .findOne()
    .select(`
      -manage_password
      -article
      -telebot
      -facebook.client_secret 
      -zalo.client_secret 
      -tiktok.client_secret
      -google.client_secret
    `) as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'
    if(!!config.license) throw 'Trang không chính thống'

    // Clone Config
    const result = JSON.parse(JSON.stringify(config))

    // Get Collab Config
    const adsCollabCode = getCookie(event, 'ads-collab')
    if(!!adsCollabCode){
      const adsCollab = await DB.AdsCollab.findOne({ code: adsCollabCode })
      if(!!adsCollab) result.collab = adsCollab
    }

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})