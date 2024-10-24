import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { size, current, sort, search, game : gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)
    
    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { game: game._id }
    if(!!search){
      const users = await DB.User.find({
        username : { $regex : search.toLowerCase(), $options : 'i' }
      }).select('_id')
      match['user'] = { $in: users.map(i => i._id) }
    }

    const list = await DB.GamePrivateUser.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "User",
          localField: "user",
          foreignField: "_id",
          pipeline: [
            { $project: { username: 1 }}
          ],
          as: "user"
        }
      },
      { $unwind: { path: '$user'} },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size },
    ])

    const total = await DB.GamePrivateUser.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})