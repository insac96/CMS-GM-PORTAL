import type { Mongoose } from 'mongoose'
import type { IDBGamePlatform, IDBGameCategory } from '~~/types'
export * from './tool'
export * from './china'
export * from './private'

export const DBGamePlatform = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePlatform>({ 
    name: { type: String },
    icon: { type: String },
    key: { type: String },
    display: { type: Boolean, default: true }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text' })
  const model = mongoose.model('GamePlatform', schema, 'GamePlatform')

  const autoCreate = async () => {
    const h5 = await model.count({key: 'h5'})
    const mobile = await model.count({key: 'mobile'})
    const pc = await model.count({key: 'pc'})
    const webgame = await model.count({key: 'web-game'})
  
    if(h5 == 0) await model.create({ name: 'Game H5', icon: 'i-bxs-devices', key: 'h5' })
    if(mobile == 0) await model.create({ name: 'Game Mobile', icon: 'i-bx-mobile', key: 'mobile' })
    if(pc == 0) await model.create({ name: 'Game PC', icon: 'i-mingcute-computer-line', key: 'pc' })
    if(webgame == 0) await model.create({ name: 'Web Game', icon: 'i-mingcute-web-fill', key: 'web-game' })
  }
  autoCreate()

  return model 
}

export const DBGameCategory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameCategory>({ 
    name: { type: String },
    icon: { type: String },
    key: { type: String },
    display: { type: Boolean, default: true }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text' })
  const model = mongoose.model('GameCategory', schema, 'GameCategory')

  const autoCreate = async () => {
    const mmo = await model.count({key: 'mmo'})
    const herocard = await model.count({key: 'the-bai'})
  
    if(mmo == 0) await model.create({ name: 'MMO', icon: 'i-ri-sword-fill', key: 'mmo' })
    if(herocard == 0) await model.create({ name: 'Thẻ Bài', icon: 'i-icon-park-twotone-card-two', key: 'the-bai' })
  }
  autoCreate()

  return model 
}

