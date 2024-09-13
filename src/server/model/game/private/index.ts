import type { Mongoose } from 'mongoose'
import type { IDBGamePrivate } from '~~/types'

export const DBGamePrivate = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivate>({ 
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

    pin: { type: Boolean, default: true },
    display: { type: Boolean, default: true }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text' })

  const model = mongoose.model('GamePrivate', schema, 'GamePrivate')
  return model 
}
