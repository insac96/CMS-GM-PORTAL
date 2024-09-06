import type { Mongoose } from 'mongoose'
import type { IDBOrder } from '~~/types'

export const DBOrder = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBOrder>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    recharge: { type: Boolean, index: true, default: false },
    mail: { type: Boolean, index: true, default: false },
    coin: { type: Number, index: true, default: 0 },
  }, {
    timestamps: true
  })

  const model = mongoose.model('Order', schema, 'Order')
  return model 
}
