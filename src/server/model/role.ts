import type { Mongoose } from 'mongoose'
import type { IDBRoleBody, IDBRoleWing, IDBRolePet } from '~~/types'

export const DBRoleBody = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBRoleBody>({ 
    name: { type: String },
    icon: { type: String },
    path: {
      frame: { type: String },
      json: { type: String },
    },
    power: { type: Number },
  })

  const model = mongoose.model('RoleBody', schema, 'RoleBody')
  return model 
}

export const DBRoleWing = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBRoleWing>({ 
    name: { type: String },
    icon: { type: String },
    path: {
      frame: { type: String },
      json: { type: String },
    },
    power: { type: Number },
  })

  const model = mongoose.model('RoleWing', schema, 'RoleWing')
  return model 
}

export const DBRolePet = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBRolePet>({ 
    name: { type: String },
    icon: { type: String },
    path: {
      frame: { type: String },
      json: { type: String },
    },
    power: { type: Number },
  })

  const model = mongoose.model('RolePet', schema, 'RolePet')
  return model 
}

