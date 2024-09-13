import type { H3Event } from 'h3'
import axios from 'axios'

interface ISendData {
  url: string
  secret: string
  account: string
}

export default async (event: H3Event, data : ISendData) : Promise<any> => {
  try {
    const send = await axios.post(data.url, data)
    const res = send.data
    if(res.error) throw res.error
    
    return Promise.resolve(res.data)
  }
  catch (e:any) {
    throw e.toString()
  }
}