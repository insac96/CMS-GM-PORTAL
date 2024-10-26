import type { Mongoose } from 'mongoose'
import type { 
  IDBGamePrivate, 
  IDBGamePrivateEvent, IDBGamePrivateEventHistory, 
  IDBGamePrivateGiftcode, IDBGamePrivateGiftcodeHistory, 
  IDBGamePrivateItem, IDBGamePrivateItemBox, 
  IDBGamePrivateRecharge, IDBGamePrivateRechargeHistory,
  IDBGamePrivateShopItem, IDBGamePrivateShopItemHistory, 
  IDBGamePrivateShopPack, IDBGamePrivateShopPackHistory, 
  IDBGamePrivateUser, 
  IDBGamePrivateUserLogin,
  IDBGamePrivateComment, 
  IDBGamePrivateServerOpen
} from '~~/types'

export const DBGamePrivate = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivate>({ 
    platform: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePlatform' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'GameCategory' },

    name: { type: String },
    code: { type: String },
    key: { type: String },
    description: { type: String },
    image: {
      banner: { type: String, default: '' },
      logo: { type: String, default: '' },
      icon: { type: String, default: '' },
      review: [{ type: String }],
    },
    
    content: { type: String },

    ip: { type: String, default: '' },
    port: { type: Number, default: 80 },
    mobile: { type: Boolean, default: false },
    paygame: { type: Boolean, default: false },
    secret: { type: String, default: '@Secret' },
    api: {
      start: { type: String, default: '' },
      server: { type: String, default: '' },
      role: { type: String, default: '' },
      roles: { type: String, default: ''},
      mail: { type: String, default: '' },
      recharge: { type: String, default: '' },
      level: { type: String, default: '' },
      power: { type: String, default: '' },
      os: { type: String, default: '' },
    },

    play: {
      web: { type: String, default: '' },
      windows: { type: String, default: '' },
      android: { type: String, default: '' },
      ios: { type: String, default: '' },
    },

    rate: {
      shop: {
        default: { type: Number, default: 0 },
        limit: {
          number: { type: Number, default: 0 },
          expired: { type: Date },
        }
      }
    },

    statistic: {
      play: { type: Number, index: true, default: 0 },
      view: { type: Number, index: true, default: 0 },
      user: { type: Number, index: true, default: 0 },
      revenue: { type: Number, index: true, default: 0 },
    },

    manager: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    pin: { type: Boolean, default: true },
    display: { type: Boolean, default: true }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text', code: 'text' })

  const model = mongoose.model('GamePrivate', schema, 'GamePrivate')
  return model 
}

// Server Open
export const DBGamePrivateServerOpen = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateServerOpen>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },
    server_name: { type: String },
    opentime: { type: Date },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateServerOpen', schema, 'GamePrivateServerOpen')
  return model 
}

// User
export const DBGamePrivateUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },

    block: { type: Boolean, index: true, default: false },

    spend: {
      day: {
        coin: { type: Number, index: true, default: 0 },
        count: { type: Number, index: true, default: 0 },
      },
      week: {
        coin: { type: Number, index: true, default: 0 },
        count: { type: Number, index: true, default: 0 },
      },
      month: {
        coin: { type: Number, index: true, default: 0 },
        count: { type: Number, index: true, default: 0 },
      },
      total: {
        coin: { type: Number, index: true, default: 0 },
        count: { type: Number, index: true, default: 0 },
      }
    },

    login: {
      week: { type: Number, index: true, default: 0 },
      month: { type: Number, index: true, default: 0 },
      total: { type: Number, index: true, default: 0 },
      update: { type: Date, default: Date.now() },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateUser', schema, 'GamePrivateUser')
  return model 
}

export const DBGamePrivateUserLogin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateUserLogin>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateUserLogin', schema, 'GamePrivateUserLogin')
  return model 
}

// Recharge
export const DBGamePrivateRecharge = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateRecharge>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },

    recharge_id: { type: String },
    recharge_name: { type: String },
    save_pay: { type: Number, default: 0, index: true },
    price: { type: Number, default: 0, index: true },
    pin: { type: Boolean, default: false, index: true },
    display: { type: Boolean, default: true, index: true },
  }, {
    timestamps: true
  })

  schema.index({ recharge_id: 'text', recharge_name: 'text' })
  const model = mongoose.model('GamePrivateRecharge', schema, 'GamePrivateRecharge')
  return model 
}

export const DBGamePrivateRechargeHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateRechargeHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },
    recharge: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateRecharge' },

    price: { type: Number },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateRechargeHistory', schema, 'GamePrivateRechargeHistory')
  return model 
}

// Item
export const DBGamePrivateItem = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateItem>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },

    item_id: { type: String },
    item_name: { type: String },
    item_image: { type: String }
  }, {
    timestamps: true
  })
  
  schema.index({ item_id: 'text', item_name: 'text' })
  const model = mongoose.model('GamePrivateItem', schema, 'GamePrivateItem')
  return model 
}

export const DBGamePrivateItemBox = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateItemBox>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },

    name: { type: String },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem' },
      amount: { type: Number, index: true },
    }]
  }, {
    timestamps: true
  })
  
  schema.index({ name: 'text' })
  const model = mongoose.model('GamePrivateItemBox', schema, 'GamePrivateItemBox')
  return model 
}

// Shop Item
export const DBGamePrivateShopItem = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateShopItem>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem' },

    amount: { type: Number, default: 0, index: true },
    price: { type: Number, default: 0, index: true },
    limit: { type: Number, default: 0, index: true },
    pin: { type: Boolean, default: false, index: true },
    display: { type: Boolean, default: true, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateShopItem', schema, 'GamePrivateShopItem')
  return model 
}

export const DBGamePrivateShopItemHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateShopItemHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem' },

    price: { type: Number, index: true },
    amount: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateShopItemHistory', schema, 'GamePrivateShopItemHistory')
  return model 
}

// Shop Pack
export const DBGamePrivateShopPack = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateShopPack>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },

    name: { type: String },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem' },
      amount: { type: Number, index: true },
    }],
    price: { type: Number, default: 0, index: true },
    limit: { type: Number, default: 0, index: true },
    pin: { type: Boolean, default: false, index: true },
    display: { type: Boolean, default: true, index: true },
  }, {
    timestamps: true
  })

  schema.index({ name: 'text' })

  const model = mongoose.model('GamePrivateShopPack', schema, 'GamePrivateShopPack')
  return model 
}

export const DBGamePrivateShopPackHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateShopPackHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },
    pack: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateShopPack' },

    price: { type: Number, index: true },
    amount: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateShopPackHistory', schema, 'GamePrivateShopPackHistory')
  return model 
}

// Giftcode
export const DBGamePrivateGiftcode = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateGiftcode>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },

    code: { type: String },
    servers: [{ type: String }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem' },
      amount: { type: Number, index: true },
    }],
    limit: { type: Number, default: 0, index: true },
    expired: { type: Date, index: true },
    public: { type: Boolean, default: false, index: true },
    justone: { type: Boolean, default: false, index: true },
    display: { type: Boolean, default: true, index: true },
  }, {
    timestamps: true
  })

  schema.index({ code: 'text' })

  const model = mongoose.model('GamePrivateGiftcode', schema, 'GamePrivateGiftcode')
  return model 
}

export const DBGamePrivateGiftcodeHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateGiftcodeHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },
    giftcode: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateGiftcode' },

    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateGiftcodeHistory', schema, 'GamePrivateGiftcodeHistory')
  return model 
}

// Event
export const DBGamePrivateEvent = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateEvent>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },

    type: { type: String },
    need: { type: Number, default: 0, index: true },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem' },
      amount: { type: Number, index: true },
    }],
    display: { type: Boolean, default: true, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateEvent', schema, 'GamePrivateEvent')
  return model 
}

export const DBGamePrivateEventHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateEventHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateEvent' },

    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateEventHistory', schema, 'GamePrivateEventHistory')
  return model 
}

// Comment
export const DBGamePrivateComment = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateComment>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser' },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },
    content: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateComment', schema, 'GamePrivateComment')
  return model 
}
