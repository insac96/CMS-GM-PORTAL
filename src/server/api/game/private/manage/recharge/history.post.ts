import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên cấp cao'

    const { size, current, sort, search, game : gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { game: game._id }
    if(search){
      const users = await DB.User.find({
        username : { $regex : search.key.toLowerCase(), $options : 'i' }
      }).select('_id')
      const usersGame = await DB.GamePrivateUser.find({
        user: { $in: users.map(i => i._id) }
      }).select('_id')
      
      match['user'] = { $in: usersGame.map(i => i._id) }
    }

    const list = await DB.GamePrivateRechargeHistory
    .find(match)
    .populate({ path: 'user', select: 'user', populate: { path: 'user', select: 'username' }})
    .populate({ path: 'recharge', select: 'recharge_name' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GamePrivateRechargeHistory.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})