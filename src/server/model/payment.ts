import type { Mongoose } from 'mongoose'
import type { IDBPayment } from '~~/types'

export const DBPayment = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBPayment>({ 
    gate: { type: mongoose.Schema.Types.ObjectId, ref: 'Gate' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    card: {
      net: { type: String }, 
      seri: { type: String }, 
      pin: { type: String },
    },
    money: { type: Number, index: true },
    code: { type: String }, 
    token: { type: String },
    qrcode: { type: String },
    status: { type: Number, default: 0 , index: true }, // 0-Wait 1-Success 2-Refuse,
    verify: {
      person: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      time: { type: Date },
      reason: { type: String },
    }
  }, {
    timestamps: true
  })

  schema.index({ code: 'text' })

  const model = mongoose.model('Payment', schema, 'Payment')
  return model 
}
