import mongoose from 'mongoose'
const { Schema } = mongoose
import { v4 as uuidv4 } from 'uuid'


const accountSchema = new Schema({
  _id: { // note we do not need and also cannot specify the property unique: true
    type: String,
    default: uuidv4(),
  },

  /* account name */
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 200,
  },

  /* A shorted version of the account name */
  shortname: {
    type: String,
    unique: true,
    trim: true,
    maxLength: 40,
  },

  /* A optional code for the company */
  code: {
    type: String,
    unique: true,
    trim: true,
    maxLength: 12,
  },

  /* is the user account active? */
  active: { type: Boolean, default: true },

  /* is the user blocked? */
  blocked: { type: Boolean, default: false },

  /* is the user blocked? */
  expires: { type: Date, default: null },

  /* is the user blocked? */
  owner: {
    type: Schema.Types.String,
    ref: 'ifc_core_user',
    default: null,
  },

  /* is the user blocked? */
  organization: {
    type: Schema.Types.String,
    ref: 'ifc_core_organization',
    default: null,
  },

  /* tags */
  tags: [String],

  /* soft delete */
  isDeleted: { type: false }
    
}, { timestamp: true })

const Account = mongoose.model('pacifico_core_account', accountSchema)

export default Account
