import type { Server as SocketServer, Socket } from 'socket.io'

let online = 0

export default (event : any, io : SocketServer) => {
  io.on('connection', (socket : Socket) => {
    socket.on('online', () => {
      online++
      io.emit('online', online)
    })

    socket.on('disconnect', () => {
      online--
      io.emit('online', online)
    })
  })

  global.IO = io
}