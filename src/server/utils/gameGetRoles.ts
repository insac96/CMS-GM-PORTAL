import type { H3Event } from 'h3'
import axios from 'axios'

interface ISendData {
  url: string
  secret: string
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
    const send = await axios.post(data.url, data)
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