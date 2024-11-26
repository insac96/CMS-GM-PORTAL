import type { Server as SocketServer, Socket } from 'socket.io'
import type { Types } from 'mongoose'

const sendOnline = async (io : SocketServer) => {
  const online = await DB.SocketOnline.aggregate([
    { $addFields: { user: { $cond: [{$not: ["$user"]}, '$socket', '$user']} }},
    { $group: { _id: '$user' }}
  ])

  io.emit('online', online.length)
}

export default (io : SocketServer, socket : Socket) => {
  socket.on('online-join', async (id : Types.ObjectId | null) => {
    if(!id)  await DB.SocketOnline.create({ socket: socket.id })
    else {
      const user = await DB.User.findOne({ _id: id }).select('_id')
      if(!!user) {
        await DB.SocketOnline.create({ socket: socket.id, user: user._id })
        socket.join(user._id.toString())
      }
    }
  
    sendOnline(io)
  })

  socket.on('online-login', async (id : Types.ObjectId) => {
    const user = await DB.User.findOne({ _id: id }).select('_id')
    if(!!user){
      await DB.SocketOnline.updateOne({ socket: socket.id }, { user: user.id })
      socket.join(user._id.toString())
    }
    sendOnline(io)
  })

  socket.on('online-logout', async (id : Types.ObjectId) => {
    const user = await DB.User.findOne({ _id: id }).select('_id')
    if(!!user) {
      await DB.SocketOnline.updateOne({ socket: socket.id }, { user: null })
      socket.leave(user._id.toString())
    }
    sendOnline(io)
  })

  socket.on('disconnect', async () => {
    await DB.SocketOnline.deleteOne({ socket: socket.id })
    sendOnline(io)
  })
}