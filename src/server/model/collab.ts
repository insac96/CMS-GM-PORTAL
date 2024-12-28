import type { Mongoose } from 'mongoose'
import type { IDBCollab, IDBCollabIncome, IDBCollabLevel, IDBCollabNotify, IDBCollabWithdraw } from "~~/types"

export const DBCollabLevel = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBCollabLevel>({
    number: { type: Number },
    commission: {
      game: {
        private: { type: Number, default: 0 },
        china: { type: Number, default: 0 },
        tool: { type: Number, default: 0 },
      },
      vip: { type: Number, default: 0 },
    }
  })

  const model = mongoose.model('CollabLevel', schema, 'CollabLevel')
  return model 
}

export const DBCollab = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBCollab>({
    level: { type: mongoose.Schema.Types.ObjectId, ref: 'CollabLevel' },
    code: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String },
    view: { type: Number, default: 0, index: true },
    money: { type: Number, default: 0, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('Collab', schema, 'Collab')
  return model 
}

export const DBCollabNotify = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBCollabNotify>({
    title: { type: String },
    content: { type: String },
    pin: { type: Boolean, default: true  },
  }, {
    timestamps: true
  })

  const model = mongoose.model('CollabNotify', schema, 'CollabNotify')
  return model 
}

export const DBCollabIncome = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBCollabIncome>({
    collab: { type: mongoose.Schema.Types.ObjectId, ref: 'Collab' },
    type: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId },
    source: { type: mongoose.Schema.Types.ObjectId },
    content: { type: String },
    server: { type: String },
    role: { type: String },
    coin: { type: Number, index: true },
    money: { type: Number, index: true },
    commission: {
      game: { type: Number, index: true },
      level: { type: Number, index: true },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('CollabIncome', schema, 'CollabIncome')
  return model 
}

export const DBCollabWithdraw = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBCollabWithdraw>({
    collab: { type: mongoose.Schema.Types.ObjectId, ref: 'Collab' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    code: { type: String },
    money: { type: Number, index: true },
    status: { type: Number, index: true, default: 0 },
    bank: {
      name: { type: String },
      number: { type: String },
      person: { type: String },
    },
    verify: {
      person: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      time: { type: Date },
      reason: { type: String },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('CollabWithdraw', schema, 'CollabWithdraw')
  return model 
}