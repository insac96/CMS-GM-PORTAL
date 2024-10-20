import type { IAuth, IDBUser, IDBGameToolUser, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth

    const user = await DB.User.findOne({ _id: auth._id }).select('currency') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    const { game : code, recharge, mail } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!recharge && !mail) throw 'Vui lòng lựa chọn 1 loại tool để mua'

    const game = await DB.GameTool.findOne({ code: code, display: true }).select('price') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const userGame = await DB.GameToolUser.findOne({ game: game._id, user: user._id }) as IDBGameToolUser
    let totalPrice = 0
    let result : any 

    // No User Game Tool
    if(!userGame){
      const newUserGame = { user: user._id, game: game._id, recharge: false, mail: false, coin: 0 }
      if(!!recharge) {
        totalPrice = totalPrice + game.price.recharge
        newUserGame.recharge = true
      }
      if(!!mail) {
        totalPrice = totalPrice + game.price.mail
        newUserGame.mail = true
      }

      if(!runtimeConfig.public.dev && auth.type == 100) totalPrice = 0 // Admin Free
      newUserGame.coin = totalPrice
      if(totalPrice > user.currency.coin) throw 'Số dư tài khoản không đủ, vui lòng nạp thêm'

      const newUserGameData = await DB.GameToolUser.create(newUserGame)
      await DB.User.updateOne({ _id: user._id },{ $inc: { 'currency.coin': totalPrice * -1 }})
      await DB.GameTool.updateOne({ _id: game._id }, { $inc: { 'statistic.user': 1 } })
      await DB.GameToolPayment.create({
        user: newUserGameData._id,
        game: game._id,
        coin: totalPrice
      })
      result = { recharge: newUserGame.recharge, mail: newUserGame.mail }
    }
    
    // Has User Game Tool
    if(!!userGame){
      if(!!userGame.recharge && !!userGame.mail) throw 'Bạn đã mua tất cả tool của trò chơi này'
      if(!!recharge && !userGame.recharge) totalPrice = totalPrice + game.price.recharge
      if(!!mail && !userGame.mail) totalPrice = totalPrice + game.price.mail

      if(!runtimeConfig.public.dev && auth.type == 100) totalPrice = 0 // Admin, Dev Free
      if(totalPrice > user.currency.coin) throw 'Số dư tài khoản không đủ, vui lòng nạp thêm'

      if(!!recharge && !userGame.recharge) userGame.recharge = true
      if(!!mail && !userGame.mail) userGame.mail = true
      userGame.coin = userGame.coin + totalPrice

      // @ts-expect-error
      await userGame.save()
      await DB.User.updateOne({ _id: user._id },{ $inc: { 'currency.coin': totalPrice * -1 }})
      await DB.GameToolPayment.create({
        user: userGame._id,
        game: game._id,
        coin: totalPrice
      })
      result = { recharge: userGame.recharge, mail: userGame.mail }
    }

    // Update revenue game
    await DB.GameTool.updateOne({ _id: game._id }, { $inc: { 'statistic.revenue': totalPrice }})

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})