import type { Mongoose } from 'mongoose'
import type { IDBCollab, IDBCollabNotify } from "~~/types"

export const DBCollab = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBCollab>({
    code: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String },
    view: { type: Number, default: 0, index: true },
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