import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Bạn không phải quản trị viên cấp cao'

    const { size, current, sort, search, game : _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID trò chơi'
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const game = await DB.GamePrivate.findOne({ _id: _id }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { game: game._id }
    if(search.key){
      if(search.by == 'CODE'){
        match['code'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      }
      if(search.by == 'USER'){
        const users = await DB.User.find({
          username : { $regex : search.key.toLowerCase(), $options : 'i' }
        }).select('_id')
        const usersGame = await DB.GamePrivateUser.find({
          user: { $in: users.map(i => i._id) },
          game: game._id
        }).select('_id')
        
        match['user'] = { $in: usersGame.map(i => i._id) }
      }
    }

    const list = await DB.GamePrivatePayment
    .find(match)
    .populate({ path: 'user', select: 'user', populate: { path: 'user', select: 'username' }})
    .populate({ path: 'game', select: 'name' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GamePrivatePayment.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})