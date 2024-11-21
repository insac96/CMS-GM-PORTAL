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
      if(search.by == 'CODE'){
        const giftcode = await DB.GamePrivateGiftcode.find({
          code : { $regex : search.key.toLowerCase(), $options : 'i' }
        }).select('_id')

        match['giftcode'] = { $in: giftcode.map(i => i._id)}
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

    const list = await DB.GamePrivateGiftcodeHistory
    .find(match)
    .populate({ path: 'user', select: 'user', populate: { path: 'user', select: 'username' }})
    .populate({ path: 'giftcode', select: 'code' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GamePrivateGiftcodeHistory.count(match)

    return resp(event, { result: { list, total }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})