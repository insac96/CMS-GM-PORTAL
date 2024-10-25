import type { Mongoose } from 'mongoose'
import type { IDBSocketChatGlobal } from '~~/types'

export const DBSocketChatGlobal= (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBSocketChatGlobal>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
    type: { type: String, default: 'USER' },
  }, {
    timestamps: true
  })

  const model = mongoose.model('SocketChatGlobal', schema, 'SocketChatGlobal')
  return model 
}
