import type { Mongoose } from 'mongoose'
import type { IDBUser, IDBUserLevel } from '~~/types'
import md5 from 'md5'

export const DBUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUser>({ 
    username: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    avatar: { type: String, default: '/images/user/default.png' },
    level: { type: mongoose.Schema.Types.ObjectId, ref: 'UserLevel' },
    reg: {
      platform: { type: String, default: 'local' },
    },
    social: {
      facebook: { type: String, default: '' },
      messenger: { type: String, default: '' },
      zalo: { type: String, default: '' },
      telegram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    currency: {
      exp: { type: Number, default: 0, index: true },
      coin: { type: Number, default: 0, index: true }
    },
    china: {
      youxi: { type: Boolean, default: false },
    },
    type: { type: Number, default: 0, index: true }, // 0 - Member, 1 - GMod, 2 - FMod, 100 - Admin, 99 - Robot
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

    // Default
    if(bot == 0) await model.create({ username: 'bot', avatar: '/images/user/robot.png', type: 99, currency: { exp: 100000000 } })
    if(admin == 0) await model.create({ username: 'admin', password: '93483a1b04eed0926606477ef0bb67b0', type: 100, currency: { exp: 100000000 } })
    if(test123 == 0) await model.create({ username: 'test123', password: 'cad40931db577dfa67ca15f02bbefc69', type: 100, currency: { exp: 100000000 } })
  }

  autoCreate()
  return model
}

export const DBUserLevel = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUserLevel>({ 
    title: { type: String, default: '' },
    number: { type: Number, default: 1, index: true },
    exp: { type: Number, default: 0, index: true },
    stone: { type: Number, default: 1, index: true },
    bonus: {
      payment: { type: Number, default: 0, index: true }
    },
    limit: {
      chat: { type: Number, default: 0, index: true }
    },
    discount: {
      shop: { type: Number, default: 0, index: true }
    }
  })

  const model = mongoose.model('UserLevel', schema, 'UserLevel')

  const autoCreate = async () => {
    const lv1 = await model.count({ number: 1 })
    const lv2 = await model.count({ number: 2 })
    const lv3 = await model.count({ number: 3 })
    const lv4 = await model.count({ number: 4 })
    const lv5 = await model.count({ number: 5 })
    const lv6 = await model.count({ number: 6 })
    const lv7 = await model.count({ number: 7 })
    const lv8 = await model.count({ number: 8 })
    const lv9 = await model.count({ number: 9 })
    const lv10 = await model.count({ number: 10 })

    // Default
    if(lv1 == 0) await model.create({ title: 'Luyện Khí', number: 1, exp: 0, stone: 1, bonus: { payment: 0 }, limit: { chat: 5 }, discount: { shop: 0 } })
    if(lv2 == 0) await model.create({ title: 'Trúc Cơ', number: 2, exp: 50000, stone: 2, bonus: { payment: 1 }, limit: { chat: 10 }, discount: { shop: 1 } })
    if(lv3 == 0) await model.create({ title: 'Kim Đan', number: 3, exp: 500000, stone: 2, bonus: { payment: 1 }, limit: { chat: 15 }, discount: { shop: 1 } })
    if(lv4 == 0) await model.create({ title: 'Nguyên Anh', number: 4, exp: 1000000, stone: 2, bonus: { payment: 2 }, limit: { chat: 20 }, discount: { shop: 2 } })
    if(lv5 == 0) await model.create({ title: 'Hóa Thần', number: 5, exp: 3000000, stone: 3, bonus: { payment: 3 }, limit: { chat: 25 }, discount: { shop: 3 } })
    if(lv6 == 0) await model.create({ title: 'Luyện Hư', number: 6, exp: 5000000, stone: 3, bonus: { payment: 4 }, limit: { chat: 30 }, discount: { shop: 4 } })
    if(lv7 == 0) await model.create({ title: 'Hợp Thể', number: 7, exp: 10000000, stone: 3, bonus: { payment: 5 }, limit: { chat: 35 }, discount: { shop: 5 } })
    if(lv8 == 0) await model.create({ title: 'Đại Thừa', number: 8, exp: 20000000, stone: 4, bonus: { payment: 10 }, limit: { chat: 40 }, discount: { shop: 10 } })
    if(lv9 == 0) await model.create({ title: 'Độ Kiếp', number: 9, exp: 50000000, stone: 4, bonus: { payment: 12 }, limit: { chat: 50 }, discount: { shop: 12 } })
    if(lv10 == 0) await model.create({ title: 'Huyễn Tiên', number: 10, exp: 100000000, stone: 5, bonus: { payment: 20 }, limit: { chat: 1000 }, discount: { shop: 20 } })
  }

  autoCreate()
  return model
}