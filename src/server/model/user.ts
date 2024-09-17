import type { Mongoose } from 'mongoose'
import type { IDBUser } from '~~/types'
import md5 from 'md5'

export const DBUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUser>({ 
    username: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    avatar: { type: String, default: '/images/user/default.png' },
    reg: {
      platform: { type: String, default: 'local' },
    },
    social: {
      facebook: { type: String, default: '' },
      zalo: { type: String, default: '' },
      telegram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    currency: {
      coin: { type: Number, default: 0, index: true }
    },
    type: { type: Number, default: 0, index: true }, // 0 - Member, 1 - Smod, 2 - Dev, 3 - Admin, 99 - Robot
    block: { type: Boolean, default: false }, // 0 - False, 1 - True
    token: { type: String },
  }, {
    timestamps: true
  })

  schema.index({ username: 'text', email: 'text', phone: 'text' })
  const model = mongoose.model('User', schema, 'User')

  const autoCreate = async () => {
    const admin = await model.count({username: 'admin'})
    const bot = await model.count({username: 'bot'})
    const test123 = await model.count({username: 'test123'})
    const hung = await model.count({username: 'hung'})
    const quan31 = await model.count({username: 'quan31'})
    const truongkg113 = await model.count({username: 'truongkg113'})

    // Default
    if(bot == 0) await model.create({ username: 'bot', avatar: '/images/user/robot.png', type: 99 })
    if(admin == 0) await model.create({ username: 'admin', password: '93483a1b04eed0926606477ef0bb67b0', type: 3 })
    if(test123 == 0) await model.create({ username: 'test123', password: 'cad40931db577dfa67ca15f02bbefc69', type: 3 })
    if(hung == 0) await model.create({ username: 'hung', password: md5('hung@eni'), type: 2 })
    if(quan31 == 0) await model.create({ username: 'quan31', password: md5('quan@eni'), type: 2 })
    if(truongkg113 == 0) await model.create({ username: 'truongkg113', password: md5('Truongkg@123'), type: 2 })
  }

  autoCreate()
  return model
}