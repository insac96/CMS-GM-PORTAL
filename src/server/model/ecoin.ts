import type { Mongoose } from 'mongoose'
import type { IDBEcoinP2PBuy, IDBEcoinP2PBuyHistory, IDBEcoinP2PSell, IDBEcoinP2PSellHistory, IDBEcoinSeason } from '~~/types'

export const DBEcoinSeason = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEcoinSeason>({ 
    title: { type: String },

    ecoin: { type: Number, index: true },
    vnd: { type: Number, index: true },

    time: {
      start: { type: Date },
      end: { type: Date }
    },

    active: { type: Boolean },
  }, {
    timestamps: true
  })

  const model = mongoose.model('EcoinSeason', schema, 'EcoinSeason')
  return model 
}

export const DBEcoinP2PBuy = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEcoinP2PBuy>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ecoin: { type: Number, index: true },
    vnd: { type: Number, index: true },

    limit: {
      start: { type: Number, index: true },
      end: { type: Number, index: true }
    },

    status: { type: Number, index: true }
  }, {
    timestamps: true
  })

  const model = mongoose.model('EcoinP2PBuy', schema, 'EcoinP2PBuy')
  return model 
}

export const DBEcoinP2PBuyHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEcoinP2PBuyHistory>({ 
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    booth: { type: mongoose.Schema.Types.ObjectId, ref: 'EcoinP2PBuy' },
  
    ecoin: { type: Number, index: true },
    vnd: { type: Number, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('EcoinP2PBuyHistory', schema, 'EcoinP2PBuyHistory')
  return model 
}

export const DBEcoinP2PSell = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEcoinP2PSell>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ecoin: { type: Number, index: true },
    vnd: { type: Number, index: true },

    limit: {
      start: { type: Number, index: true },
      end: { type: Number, index: true }
    },

    status: { type: Number, index: true }
  }, {
    timestamps: true
  })

  const model = mongoose.model('EcoinP2PSell', schema, 'EcoinP2PSell')
  return model 
}

export const DBEcoinP2PSellHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEcoinP2PSellHistory>({ 
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    booth: { type: mongoose.Schema.Types.ObjectId, ref: 'EcoinP2PSell' },
  
    ecoin: { type: Number, index: true },
    vnd: { type: Number, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('EcoinP2PSellHistory', schema, 'EcoinP2PSellHistory')
  return model 
}