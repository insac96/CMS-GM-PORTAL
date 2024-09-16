import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { avatar, social } = await readBody(event)
    if(!avatar || !social) throw 'Thông tin đầu vào chưa đủ'
  
    const user = await DB.User
    .findOne({ _id: auth._id })
    .select('avatar social block') as IDBUser

    if(!user) throw 'Tài khoản không tồn tại'
    if(!!user.block) throw 'Tài khoản đang bị khóa, không thể cập nhật'

    user.avatar = avatar
    user.social = {
      facebook: social.facebook || null,
      zalo: social.zalo || null,
      telegram: social.telegram || null,
      tiktok: social.tiktok || null,
    }
    await user.save()

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})