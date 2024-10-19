import type { H3Event } from 'h3'
import axios from 'axios'

interface ISendData {
  url: string
  secret: string
  message: string
  china?: any
}

export default async (event: H3Event, data : ISendData) : Promise<boolean> => {
  try {
    if(!data.url || !data.message || !data.secret) throw true

    await axios.post(data.url, data)
    return true
  }
  catch (e:any) {
    return false
  }
}