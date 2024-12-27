import type { Mongoose } from 'mongoose'
import type { IDBGameChina, IDBGameChinaUser, IDBGameChinaPayment, IDBGameChinaComment, IDBGameChinaLogAdmin } from '~~/types'

export const DBGameChina = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameChina>({ 
    platform: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePlatform' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'GameCategory' },

    name: { type: String },
    code: { type: String },
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
      web: { type: String, default: '' },
      windows: { type: String, default: '' },
      android: { type: String, default: '' },
      ios: { type: String, default: '' },
    },

    rate: {
      pay: { type: Number, default: 1 },
    },

    statistic: {
      play: { type: Number, index: true, default: 0 },
      view: { type: Number, index: true, default: 0 },
      user: { type: Number, index: true, default: 0 },
      revenue: { type: Number, index: true, default: 0 },
    },

    collab: {
      commission: { type: Number, index: true, default: 10 },
    },

    manager: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    pin: { type: Boolean, default: true },
    display: { type: Boolean, default: true }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text', code: 'text' })

  const model = mongoose.model('GameChina', schema, 'GameChina')
  return model 
}

export const DBGameChinaUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameChinaUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GameChina' },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameChinaUser', schema, 'GameChinaUser')
  return model 
}

export const DBGameChinaPayment = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameChinaPayment>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GameChinaUser' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GameChina' },
    code: { type: String },
    coin: { type: Number, index: true, default: 0 },
    status: { type: Number, index: true, default: 0 },
    verify: {
      person: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      time: { type: Date },
      reason: { type: String },
    }
  }, {
    timestamps: true
  })

  schema.index({ code: 'text' })

  const model = mongoose.model('GameChinaPayment', schema, 'GameChinaPayment')
  return model 
}

export const DBGameChinaComment = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameChinaComment>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GameChinaUser' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GameChina' },
    content: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameChinaComment', schema, 'GameChinaComment')
  return model 
}

export const DBGameChinaLogAdmin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameChinaLogAdmin>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GameChina' },
    content: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameChinaLogAdmin', schema, 'GameChinaLogAdmin')
  return model 
}