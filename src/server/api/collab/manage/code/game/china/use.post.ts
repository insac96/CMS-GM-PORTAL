import type { Types } from "mongoose"
import type { IAuth, IDBCollab, IDBGameChina } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { _id: gameID, collab : code, type } = await readBody(event)
    if(!type) throw 'Không tìm thấy kiểu hành động'
    if(!code) throw 'Không tìm thấy mã cộng tác viên'
     
    const collab = await DB.Collab.findOne({ code: code }).select('code user') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    if(type == 'toggle-single'){
      if(!gameID) throw 'Không tìm thấy ID trò chơi'
      const game = await DB.GameChina.findOne({ _id: gameID }).select('collab') as IDBGameChina
      const check = game.collab.use.find((item: Types.ObjectId) => item.toString() == collab._id.toString())

      if(!check) await DB.GameChina.updateOne({ _id: game._id }, { $push: { 'collab.use': collab._id } })
      else await DB.GameChina.updateOne({ _id: game._id }, { $pull: { 'collab.use': collab._id } })
    }

    else if(type == 'add-all') {
      await DB.GameChina.updateMany({ }, { $push: { 'collab.use': collab._id } })
    }

    else if(type == 'del-all') {
      await DB.GameChina.updateMany({ }, { $pull: { 'collab.use': collab._id } })
    }

    else throw 'Kiểu hành động không hợp lệ'
      
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})