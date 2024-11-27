import type { Mongoose } from 'mongoose'
import type { IDBSocketChatGlobal, IDBSocketChatSingle, IDBSocketChatSingleMessage, IDBSocketOnline } from '~~/types'

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
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  })

  const model = mongoose.model('SocketOnline', schema, 'SocketOnline')
  const autoCreate = async () => await model.deleteMany()
  autoCreate()

  return model 
}


export const DBSocketChatSingle = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBSocketChatSingle>({ 
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }, {
    timestamps: true
  })

  const model = mongoose.model('SocketChatSingle', schema, 'SocketChatSingle')
  return model 
}

export const DBSocketChatSingleMessage = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBSocketChatSingleMessage>({ 
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'SocketChatSingle' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String }
  }, {
    timestamps: true
  })

  schema.index({ content: 'text' })
  const model = mongoose.model('SocketChatSingleMessage', schema, 'SocketChatSingleMessage')
  return model 
}