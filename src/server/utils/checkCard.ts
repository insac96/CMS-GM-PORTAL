import type { H3Event } from 'h3'
import axios from 'axios'
import md5 from 'md5'

interface ICardData {
  net: string
  seri: string
  pin: string
  money: number
  token: string
  code: string
  key: string
}

export default async (event: H3Event, card : ICardData) : Promise<void> => {
  const { net, seri, pin, money, key, token, code } = card
  const url = 'https://thesieure.com/chargingws/v2'

  const partner = key.split('-')
  const partner_id = partner[0]
  const partner_key = partner[1]
  if(!partner_id || !partner_key) throw 'Khóa bí mật không chính xác, vui lòng liện hệ CSKH để được hỗ trợ'

  const params = {
    'telco': net,
    'code': pin,
    'serial': seri,
    'amount': String(money),
    'request_id': code+'-'+token,
    'partner_id': partner_id,
    'sign':  md5(partner_key + '' + pin + '' + seri),
    'command': 'charging',
  }

  const send = await axios({ url: url, data: params })
  const res = send.data
  
  const status = res['status']
  if(!status) throw 'Lỗi hệ thống API'
  if(status != 1 && status != 2 && status != 99) throw 'Lỗi thẻ hoặc hệ thống bảo trì'
}