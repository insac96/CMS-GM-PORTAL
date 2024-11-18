import md5 from 'md5'
import { IDBGamePrivate, IDBGamePrivateUser, IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const { username, password, code : gameCode } = await readBody(event)
    if(!username || !password || !gameCode) throw 'Vui lòng nhập đầy đủ thông tin'

    // Get User
    const user = await DB.User
    .findOne({ username: username.toLowerCase() })
    .select('username password block') as IDBUser
    
    // Check User
    if(!user) throw 'Tài khoản không tồn tại'
    if(md5(password) != user.password) throw 'Mật khẩu không chính xác'
    if(!!user.block) throw 'Tài khoản của bạn đang bị khóa'

    // Get Game
    const game = await DB.GamePrivate.findOne({ code: gameCode }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    // Check User Game
    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: user._id }).select('_id') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng đăng ký chơi game trước'

    return resp(event, { result: user.username, message: 'Đăng nhập thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})