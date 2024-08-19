import type { H3Event } from 'h3'
import type { IDBConfig } from '~~/types'
import axios from 'axios'

interface ISendData {
  server_id: string
  size: number,
  current: number,
  sort: {
    column: string,
    direction: string
  },
  search: {
    key: string | null,
    by: string
  },
  total: number
}

export default async (event: H3Event, data : ISendData) : Promise<any> => {
  try {
    const config = await DB.Config.findOne().select('game') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.roles) throw 'Tính năng xem các nhân vật trong trò chơi đang bảo trì'

    const send = await axios.post(config.game.api.roles, {
      secret: config.game.secret,
        ...data
    })
    const res = send.data
    if(res.error) throw res.error
    
    return Promise.resolve(res.data || {
      list: [],
      total: 0
    })
  }
  catch (e:any) {
    throw e.toString()
  }
}