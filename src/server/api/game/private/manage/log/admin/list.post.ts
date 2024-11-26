import type { IAuth, IDBGamePrivate } from "~~/types"
import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { size, current, sort, search, game : gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!search || !search.by) throw 'Dữ liệu tìm kiếm sai'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { game: new Types.ObjectId(game._id) }
    if(search.key){
      if(search.by == 'LOG'){
        match['content'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      }

      if(search.by == 'USER'){
        const users = await DB.User.find({
          username : { $regex : search.key.toLowerCase(), $options : 'i' }
        }).select('_id')

        match['user'] = { $in: users.map(i => i._id) }
      }
    }

    const list = await DB.GamePrivateLogAdmin
    .find(match)
    .populate({ path: 'user', select: 'username' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GamePrivateLogAdmin.count(match)

    return resp(event, { result: { list, total }})
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})