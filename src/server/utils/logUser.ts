import type { H3Event } from 'h3'
import type { Types } from 'mongoose'

interface IData {
  user: Types.ObjectId,
  action: string,
  type: string,
  target?: string
}

export default async (data : IData) => {
  await DB.LogUser.create(data)
}