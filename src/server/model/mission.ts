import type { Mongoose } from 'mongoose'
import type { IDBMission, IDBMissionHistory } from '~~/types'

export const DBMission = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBMission>({ 
    title: { type: String },
    description: { type: String },
    type: { type: String },
    expired: { type: Date },
    daily: { type: Boolean, default: false },
    need: { type: String },
    gift: {
      exp: { type: Number, default: 0 },
      coin: { type: Number, default: 0 },
      ecoin: { type: Number, default: 0 },
    },
    display: { type: Boolean, default: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('Mission', schema, 'Mission')
  return model
}

export const DBMissionHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBMissionHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
  }, {
    timestamps: true
  })

  const model = mongoose.model('MissionHistory', schema, 'MissionHistory')
  return model
}