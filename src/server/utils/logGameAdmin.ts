import type { H3Event } from 'h3'
import type { Types } from 'mongoose'

export default async (event: H3Event, type: string, game: Types.ObjectId, content: string, admin?: Types.ObjectId) => {
  let dbGame: any = ''
  if(type == 'tool') dbGame = DB.GameToolLogAdmin
  if(type == 'private') dbGame = DB.GamePrivateLogAdmin
  if(type == 'china') dbGame = DB.GameChinaLogAdmin

  await dbGame.create({
    game: game,
    user: admin ? admin : event.context.auth._id,
    content: content
  })
}