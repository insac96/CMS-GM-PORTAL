import { IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã cộng tác viên'

    const collab = await DB.Collab.findOne({ code: code}).select(`code user`) as IDBCollab
    if(!collab) throw 'Không tìm thấy cấu hình cộng tác viên'

    return resp(event, { result: collab })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})