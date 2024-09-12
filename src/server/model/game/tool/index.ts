import type { Mongoose } from 'mongoose'
import type { IDBGameTool, IDBGameToolUser } from '~~/types'

export const DBGameTool = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameTool>({ 
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

    ip: { type: String, default: '' },
    port: { type: Number, default: 80 },
    mobile: { type: Boolean, default: false },
    secret: { type: String, default: '@Secret' },
    api: {
      start: { type: String, default: '' },
      server: { type: String, default: '' },
      role: { type: String, default: '' },
      roles: { type: String, default: ''},
      mail: { type: String, default: '' },
      recharge: { type: String, default: '' },
      os: { type: String, default: '' },
    },

    play: {
      web: { type: String, default: '' },
      windows: { type: String, default: '' },
      android: { type: String, default: '' },
      ios: { type: String, default: '' },
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

  const model = mongoose.model('GameTool', schema, 'GameTool')
  return model 
}

export const DBGameToolUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameToolUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GameTool' },
    recharge: { type: Boolean, index: true, default: false },
    mail: { type: Boolean, index: true, default: false },
    coin: { type: Number, index: true, default: 0 },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameToolUser', schema, 'GameToolUser')
  return model 
}
