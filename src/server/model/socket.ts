import type { Mongoose } from 'mongoose'
import type { IDBSocketChatGlobal, IDBSocketOnline } from '~~/types'

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

export const DBSocketOnline = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBSocketOnline>({ 
    socket: { type: 'String' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
  })

  const model = mongoose.model('SocketOnline', schema, 'SocketOnline')
  const autoCreate = async () => await model.deleteMany()
  autoCreate()

  return model 
}