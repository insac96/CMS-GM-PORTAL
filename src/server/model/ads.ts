import type { Mongoose } from 'mongoose'
import type { IDBAdsFrom, IDBAdsCollab } from '~~/types'

export const DBAdsFrom = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBAdsFrom>({ 
    code: { type: String },
    note: { type: String },
    view: { type: Number, default: 0, index: true },
    sign: {
      in: { type: Number, default: 0, index: true },
      up: { type: Number, default: 0, index: true },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('AdsFrom', schema, 'AdsFrom')
  return model 
}

export const DBAdsCollab = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBAdsCollab>({
    code: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String },
    view: { type: Number, default: 0, index: true },
    sign: {
      in: { type: Number, default: 0, index: true },
      up: { type: Number, default: 0, index: true },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('AdsCollab', schema, 'AdsCollab')
  return model 
}