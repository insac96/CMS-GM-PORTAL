import type { Mongoose } from 'mongoose'
import type { IDBForumCategory, IDBForumCategorySub, IDBForumPost, IDBForumPostComment, IDBForumPostLike } from '~~/types'

export const DBForumCategory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBForumCategory>({ 
    name: { type: String },
    key: { type: String },
    description: { type: String },
    icon: { type: String },
    color: { type: String },
    display: { type: Boolean, default: true }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text' })
  const model = mongoose.model('ForumCategory', schema, 'ForumCategory')

  return model 
}

export const DBForumCategorySub = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBForumCategorySub>({ 
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory' },
    name: { type: String },
    key: { type: String },
    description: { type: String },
    display: { type: Boolean, default: true }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text' })
  const model = mongoose.model('ForumCategorySub', schema, 'ForumCategorySub')

  return model 
}

export const DBForumPost = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBForumPost>({ 
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory' },
    sub: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategorySub' },
    creater: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    title: { type: String },
    content: { type: String },
    key: { type: String },

    statistic: {
      view: { type: Number, default: 0 },
      like: { type: Number, default: 0 },
      comment: { type: Number, default: 0 },
    },

    update: {
      comment: { type: Date },
      like: { type: Date },
      last: { type: Date, default: Date.now() },
    },

    enable: {
      comment: { type: Boolean, default: true }
    },

    close: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    pin: { type: Boolean, default: false }
  }, {
    timestamps: true
  })

  schema.index({ title: 'text', key: 'text' })
  const model = mongoose.model('ForumPost', schema, 'ForumPost')

  return model 
}

export const DBForumPostLike = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBForumPostLike>({ 
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }, {
    timestamps: true
  })

  const model = mongoose.model('ForumPostLike', schema, 'ForumPostLike')

  return model 
}

export const DBForumPostComment = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBForumPostComment>({ 
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('ForumPostComment', schema, 'ForumPostComment')

  return model 
}

