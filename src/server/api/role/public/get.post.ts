import type { IDBRoleBody, IDBRolePet, IDBRoleWing } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { body, wing, pet } = await readBody(event)

    const result : any = {
      body: null,
      wing: null,
      pet: null
    }
    if(!!body) result['body'] = await DB.RoleBody.findOne({ _id: body }) as IDBRoleBody
    if(!!wing) result['wing'] = await DB.RoleWing.findOne({ _id: wing }) as IDBRoleWing
    if(!!pet) result['pet'] = await DB.RolePet.findOne({ _id: pet }) as IDBRolePet

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})