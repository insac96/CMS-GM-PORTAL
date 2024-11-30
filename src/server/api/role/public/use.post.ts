import { Types } from "mongoose"
import type { IAuth, IDBUser, IDBUserLevel } from "~~/types"

const mergeArray = (input : Array<Types.ObjectId>, list : Array<Types.ObjectId>) => {
  const arr = input.concat(list)

  const merge = arr.reduce((a : Array<Types.ObjectId>, c : Types.ObjectId) => {
    const obj = a.find((obj : Types.ObjectId) => obj.toString() === c.toString())
    if(!obj) a.push(c)
    return a
  }, [])

  return merge
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { _id, type } = await readBody(event)
    if(!_id || !type) throw 'Dữ liệu đầu vào không hợp lệ'

    let DBGet : any
    if(type == 'body') DBGet = DB.RoleBody
    if(type == 'wing') DBGet = DB.RoleWing
    if(type == 'pet') DBGet = DB.RolePet
    if(!DBGet) throw 'Kiểu vật phẩm không hỗ trợ'

    const fashion = await DBGet.findOne({ _id: _id }).select('_id')
    if(!fashion) throw 'Vật phẩm không tồn tại'

    const user = await DB.User.findOne({ _id: auth._id }).select('level role') as IDBUser
    const level = await DB.UserLevel.findOne({ _id: user.level }).select('number') as IDBUserLevel
    const listLevel = await DB.UserLevel.find({ number: { $lte: level.number } }).select('role') as Array<IDBUserLevel>
    
    let listFashion : any = []
    listLevel.forEach(item => {
      const role = item.role
      
      // @ts-expect-error
      if(!!role[type]) listFashion.push(role[type].toString())
    })

    // @ts-expect-error
    listFashion = mergeArray(listFashion, user.role.bag[type])
    if(!listFashion.includes(fashion._id.toString())) throw 'Bạn không có vật phẩm này trong kho đồ'

    // Save
    await DB.User.updateOne({ _id: user._id }, { 
      [`role.use.${type}`]: fashion._id,
      [`role.custom.${type}`]: true
    })

    return resp(event, { message: 'Trang bị thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})