import type { ISendNotifyUser } from '~~/types'

export default async (sendData: ISendNotifyUser) : Promise<void> => {
  await DB.NotifyUser.create({
    user: sendData.user,
    content: sendData.content,
    color: sendData.color || 'gray'
  })
  return Promise.resolve()
}