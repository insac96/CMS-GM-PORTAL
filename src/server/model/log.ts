import type { Mongoose } from 'mongoose'
import type { IDBLogAdmin, IDBLogUser, IDBLogLogin } from '~~/types'

export const DBLogAdmin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLogAdmin>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LogAdmin', schema, 'LogAdmin')
  return model
}

export const DBLogUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLogUser>({ 
    type: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String },
    target: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('LogUser', schema, 'LogUser')
  return model
}

export const DBLogLogin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLogLogin>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LogLogin', schema, 'LogLogin')
  return model
}

