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
    const { type } = await readBody(event)
    if(!type) throw 'Dữ liệu đầu vào không hợp lệ'

    let DBGet : any
    if(type == 'body') DBGet = DB.RoleBody
    if(type == 'wing') DBGet = DB.RoleWing
    if(type == 'pet') DBGet = DB.RolePet
    if(!DBGet) throw 'Kiểu vật phẩm không hỗ trợ'

    const user = await DB.User.findOne({ _id: auth._id }).select('level role.bag') as IDBUser
    const level = await DB.UserLevel.findOne({ _id: user.level }).select('number') as IDBUserLevel
    const listLevel = await DB.UserLevel.find({ number: { $lte: level.number } }).select('role') as Array<IDBUserLevel>
    
    let listFashion : any = []
    listLevel.forEach(item => {
      const role = item.role
      
      // @ts-expect-error
      if(!!role[type]) listFashion.push(role[type])
    })

    // @ts-expect-error
    listFashion = mergeArray(listFashion, user.role.bag[type])

    const list = await DBGet.find({ _id: { $in : listFashion} })

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})