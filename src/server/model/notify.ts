import type { Mongoose } from 'mongoose'
import type { IDBNotifyUser } from '~~/types'

export const DBNotifyUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBNotifyUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    watched: { type: Boolean, default: false },
    color: { type: String, default: 'gray' },
    content: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('NotifyUser', schema, 'NotifyUser')
  return model 
}