import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const conversations = await DB.SocketChatSingle.
    aggregate([
      { $match: { $or: [{ to: auth._id }, { from: auth._id }] }},
      {
        $lookup: {
          from: "User",
          localField: "to",
          foreignField: "_id",
          as: "to",
          pipeline: [{ $project: { username: 1, avatar: 1, type: 1, level: 1, 'role.use': 1, vip: 1, online: 1 }}]
        }
      },
      { $unwind: { path: "$to", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "UserLevel",
          localField: "to.level",
          foreignField: "_id",
          as: "to.level",
        }
      },
      { $unwind: { path: "$to.level", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "User",
          localField: "from",
          foreignField: "_id",
          as: "from",
          pipeline: [{ $project: { username: 1, avatar: 1, type: 1, level: 1, 'role.use': 1, vip: 1, online: 1 }}]
        }
      },
      { $unwind: { path: "$from", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "UserLevel",
          localField: "from.level",
          foreignField: "_id",
          as: "from.level",
        }
      },
      { $unwind: { path: "$from.level", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "SocketChatSingleMessage",
          localField: "_id",
          foreignField: "conversation",
          as: "last",
          pipeline: [
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ]
        }
      },
      { $unwind: { path: "$last", preserveNullAndEmptyArrays: true }},
      { $addFields: {
        update: { $cond: [{$not: ["$last"]}, '$createdAt', '$last.createdAt']}
      }},
      { $sort: { 'update': -1 } },
    ])

    return resp(event, { result: conversations })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})