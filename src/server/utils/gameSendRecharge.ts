import type { H3Event } from 'h3'
import axios from 'axios'

interface ISendData {
  url: string
  secret: string
  account: string
  server_id: string
  role_id: string
  recharge_id: string
  save_pay: number
}

export default async (event: H3Event, data : ISendData) : Promise<void> => {
  try {
    const send = await axios.post(data.url, data)
    const res = send.data
    if(res.error) throw res.error
  }
  catch (e:any) {
    throw e.toString()
  }
}