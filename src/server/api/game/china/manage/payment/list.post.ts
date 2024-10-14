import type { IAuth, IDBGameChina } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { size, current, sort, search, game : _id } = await readBody(event)
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { }
    // Match Game
    if(!!_id){
      const game = await DB.GameChina.findOne({ _id: _id }).select('manager') as IDBGameChina
      if(!game) throw 'Trò chơi không tồn tại'
      await getAuthGM(event, auth, game)

      match['game._id'] = game._id
    }
    // Match Search
    if(search.key){
      if(search.by == 'CODE'){
        match['code'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      }
      if(search.by == 'USER'){
        const users = await DB.User.find({
          username : { $regex : search.key.toLowerCase(), $options : 'i' }
        }).select('_id')
        match['user._id'] = { $in: users.map(i => i._id) }
      }
      if(search.by == 'GAME'){
        const key = formatVNString(search.key, '-')
        const games = await DB.GameChina.find({
          $or: [
            { 'key': { $regex : key, $options : 'i' }},
            { 'code': { $regex : key, $options : 'i' }},
          ]
        }).select('_id')
        
        match['game._id'] = { $in: games.map(i => i._id) }
      }
    }

    const data = await DB.GameChinaPayment
    .aggregate([
      {
        $lookup: {
          from: "GameChinaUser",
          localField: "user",
          foreignField: "_id",
          pipeline: [{
            $project: { user: 1 }
          }],
          as: "userGame"
        }
      },
      { $unwind: { path: "$userGame", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "User",
          localField: "userGame.user",
          foreignField: "_id",
          pipeline: [{
            $project: { username: 1 }
          }],
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "User",
          localField: "verify.person",
          foreignField: "_id",
          pipeline: [{
            $project: { username: 1 }
          }],
          as: "verifyPerson"
        }
      },
      { $unwind: { path: "$verifyPerson", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "GameChina",
          localField: "game",
          foreignField: "_id",
          pipeline: [{
            $project: { name: 1, code: 1, key: 1 }
          }],
          as: "game"
        }
      },
      { $unwind: { path: "$game", preserveNullAndEmptyArrays: true }},
      { $project: {
        game: 1, 
        user: 1, 
        code: 1, 
        coin: 1, 
        status: 1, 
        createdAt: 1,
        verify: {
          person: '$verifyPerson',
          time: 1
        }
      }},
      { $match: match },
      {
        $facet: {
          list: [
            { $sort: sorting },
            { $skip: (current - 1) * size },
            { $limit: size },
          ],
          pagination: [
            { $count: "total" }
          ]
        }
      }
    ])

    return resp(event, { result: { 
      list: data[0].list ? data[0].list : [],
      total: data[0].pagination ? (data[0].pagination[0] ? data[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})