import type { Mongoose } from 'mongoose'
import type { IDBGameChina, IDBGameChinaPayment } from '~~/types'

export const DBGameChina = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameChina>({ 
    platform: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePlatform' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'GameCategory' },

    name: { type: String },
    short_name: { type: String },
    key: { type: String },
    description: { type: String },
    image: {
      banner: { type: String, default: '' },
      logo: { type: String, default: '' },
      icon: { type: String, default: '' },
      review: [{ type: String }],
    },
    
    content: { type: String },

    play: {
      web: { type: String },
      windows: { type: String },
      android: { type: String },
      ios: { type: String },
    },

    price: {
      recharge: { type: Number, index: true, default: 100000 },
      mail: { type: Number, index: true, default: 100000 },
    },

    statistic: {
      play: { type: Number, index: true, default: 0 },
      view: { type: Number, index: true, default: 0 },
    },

    pin: { type: Boolean, default: true },
    display: { type: Boolean, default: true }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text' })

  const model = mongoose.model('GameChina', schema, 'GameChina')
  return model 
}

export const DBGameChinaPayment = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameChinaPayment>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GameChina' },
    coin: { type: Number, index: true, default: 0 },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameChinaPayment', schema, 'GameChinaPayment')
  return model 
}
