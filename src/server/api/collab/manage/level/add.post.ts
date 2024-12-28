import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { number, commission } = body
    if(!number || !commission) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!commission.game) throw 'Dữ liệu đầu vào không hợp lệ'
    if(number < 1) throw 'Cấp độ không hợp lệ'
    if(
      commission.vip < 0
      || commission.game.private < 0
      || commission.game.tool < 0
      || commission.game.china < 0
    ) throw 'Hoa hồng không hợp lệ'

    const getByNumber = await DB.CollabLevel.findOne({ number: number }).select('_id')
    if(!!getByNumber) throw 'Cấp độ đã tồn tại'

    await DB.CollabLevel.create(body)
    logAdmin(event, `Thêm cấp độ cộng tác viên <b>${number}</b>`)
    
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})