import type { IAuth, IDBUser, IDBGameToolUser, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const user = await DB.User.findOne({ _id: auth._id }).select('currency') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    const { game : code, recharge, mail } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!recharge && !mail) throw 'Vui lòng lựa chọn 1 loại tool để mua'

    const game = await DB.GameTool
    .findOne({ code: code, display: true })
    .select('price') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const userGameTool = await DB.GameToolUser.findOne({ game: game._id, user: user._id }) as IDBGameToolUser
    
    let totalPrice = 0
    let result : any 

    // No User Game Tool
    if(!userGameTool){
      const newUserGameTool = { user: user._id, game: game._id, recharge: false, mail: false, coin: 0 }
      if(!!recharge) {
        totalPrice = totalPrice + game.price.recharge
        newUserGameTool.recharge = true
      }
      if(!!mail) {
        totalPrice = totalPrice + game.price.mail
        newUserGameTool.mail = true
      }

      newUserGameTool.coin = totalPrice
      if(totalPrice > user.currency.coin) throw 'Số dư tài khoản không đủ, vui lòng nạp thêm'

      await DB.GameToolUser.create(newUserGameTool)
      await DB.User.updateOne({ _id: user._id },{ $inc: { 'currency.coin': totalPrice * -1 }})
      result = { recharge: newUserGameTool.recharge, mail: newUserGameTool.mail }
    }
    
    // Has User Game Tool
    if(!!userGameTool){
      if(!!userGameTool.recharge && !!userGameTool.mail) throw 'Bạn đã mua tất cả tool của trò chơi này'
      if(!!recharge && !userGameTool.recharge) totalPrice = totalPrice + game.price.recharge
      if(!!mail && !userGameTool.mail) totalPrice = totalPrice + game.price.mail
      if(totalPrice > user.currency.coin) throw 'Số dư tài khoản không đủ, vui lòng nạp thêm'

      if(!!recharge && !userGameTool.recharge) userGameTool.recharge = true
      if(!!mail && !userGameTool.mail) userGameTool.mail = true
      userGameTool.coin = userGameTool.coin + totalPrice

      // @ts-expect-error
      await userGameTool.save()
      await DB.User.updateOne({ _id: user._id },{ $inc: { 'currency.coin': totalPrice * -1 }})
      result = { recharge: userGameTool.recharge, mail: userGameTool.mail }
    }

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})