import type { H3Event } from 'h3'
import axios from 'axios'

interface ISendData {
  url: string
  secret: string
  account: string
  server_id: string
}

export default async (event: H3Event, data : ISendData, showBoolean : boolean = false) : Promise<any> => {
  try {
    const send = await axios.post(data.url, data)
    const res = send.data

    if(!!showBoolean){
      if(res.error) return Promise.resolve(false)
      return Promise.resolve(res.data || [])
    }
    else {
      if(res.error) throw res.error
      return Promise.resolve(res.data || [])
    }
  }
  catch (e:any) {
    if(!!showBoolean) return Promise.resolve(false)
    else throw e.toString()
  }
}