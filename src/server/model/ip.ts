import type { Mongoose } from 'mongoose'
import type { IDBAdminIP, IDBBlockIP, IDBUserIP } from '~~/types'

export const DBAdminIP = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBAdminIP>({ 
    ip: { type: String }
  })

  const model = mongoose.model('AdminIP', schema, 'AdminIP')
  return model 
}

export const DBBlockIP = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBBlockIP>({ 
    ip: { type: String }
  })

  const model = mongoose.model('BlockIP', schema, 'BlockIP')
  return model 
}

export const DBUserIP = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUserIP>({ 
    ip: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  })

  const model = mongoose.model('UserIP', schema, 'UserIP')
  return model 
}

