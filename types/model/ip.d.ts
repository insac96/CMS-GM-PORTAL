export interface IDBAdminIP {
  _id: Types.ObjectId
  ip: Types.ObjectId
}

export interface IDBBlockIP {
  _id: Types.ObjectId
  ip: Types.ObjectId
}

export interface IDBUserIP {
  _id: Types.ObjectId
  ip: string
  user: Types.ObjectId
}