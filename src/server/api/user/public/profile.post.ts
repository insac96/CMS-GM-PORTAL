import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { user : _id } = await readBody(event)

    let select : any
    if(!!_id) {
      if(auth.type < 1){
        if(auth._id == _id) select = '-password -token'
        else select = '-password -email -phone -reg -social -currency -token'
      }
      else select = '-password -token'
    }
    if(!_id) select = '-password -token'

    const user = await DB.User
    .findOne({ _id: _id ? _id : auth._id })
    .select(select)
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    if(!!user.phone && auth.type < 1){
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