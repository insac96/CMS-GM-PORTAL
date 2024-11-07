import type { Mongoose } from 'mongoose'
import type { IDBConfig } from '~~/types'

export const DBConfig = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBConfig>({ 
    name: { type: String, default: 'ENI Studio' },
    short_name: { type: String, default: 'ENI' },
    description: { type: String, default: 'Một sản phẩm của ENI Group' },
    og_image: { type: String },
    logo_image: { type: String },
    makeby: { type: String, default: 'ENI Group' },
    article: {
      about: { type: String },
      privacy: { type: String },
      terms: { type: String },
      passportchina: { type: String },
      paymentchina: { type: String },
    },
    manage_password: { type: String, default: 'eni@gm' },
    license: { type: Boolean, default: false },
    yuan: { type: Number, default: 3500 },
    vip: {
      month: { type: Number, default: 500000 },
      forever: { type: Number, default: 5000000 },
    },
    download: {
      windows: { type: String, default: '' },
      mac: { type: String, default: '' },
    },
    contact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      address: { type: String, default: '' },
      prefix: { type: String, default: 'ENI' },
    },
    telebot: {
      payment: {
        create: { type: String, default: '' },
        receive: { type: String, default: '' },
      },
      game: {
        china: {
          payment: { type: String, default: '' },
        }
      }
    },
    social: {
      facebook: { type: String, default: '' },
      messenger: { type: String, default: '' },
      zalo: { type: String, default: '' },
      telegram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    facebook: {
      client_id: { type: String, default: '' },
      client_secret: { type: String, default: '' },
      client_version: { type: String, default: '' },
      client_verify: { type: String, default: '' },
      client_ads: { type: String, default: '' },
    },
    google: {
      client_id: { type: String, default: '' },
      client_secret: { type: String, default: '' },
      client_verify: { type: String, default: '' },
      client_ads: { type: String, default: '' },
    },
    tiktok: {
      client_id: { type: String, default: '' },
      client_secret: { type: String, default: '' },
      client_verify: { type: String, default: '' },
    },
    zalo: {
      client_id: { type: String, default: '' },
      client_secret: { type: String, default: '' },
      client_verify: { type: String, default: '' },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('Config', schema, 'Config')

  const autoCreate = async () => {
    const count = await model.count({})
    if(count == 0) return await model.create({})
  }

  autoCreate()
  return model 
}

