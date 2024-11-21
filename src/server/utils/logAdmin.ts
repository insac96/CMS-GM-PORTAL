import type { H3Event } from 'h3'
import type { Types } from 'mongoose'

export default async (event: H3Event, action: string, admin?: Types.ObjectId) => {
  await DB.LogAdmin.create({
    user: admin ? admin : event.context.auth._id,
    action: action
  })
}