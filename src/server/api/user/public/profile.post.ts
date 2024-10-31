import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID tài khoản'

    const auth = await getAuth(event, false) as IAuth | null
    let select : any

    if(!auth) select = '-china -email -phone -reg -social -password -token'
    if(!!auth){
      if(auth.type == 100) select = '-password -token'
      else
        if(auth._id == _id) select = '-password -token'
        select = '-china -email -phone -reg -social -password -token'
    }

    const user = await DB.User
    .findOne({ _id: _id })
    .populate({ path: 'level', select: 'title number exp stone' })
    .select(select)
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    if(!!auth && auth.type != 100 && !!user.phone){
      const fullNumber = user.phone
      const last4Digits = fullNumber.slice(-2)
      const maskedNumber = last4Digits.padStart(fullNumber.length, '*')
      user.phone = maskedNumber
    }

    return resp(event, { result: user })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})