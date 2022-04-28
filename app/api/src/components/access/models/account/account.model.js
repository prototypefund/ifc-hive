/*
 * Account Model
 *
 * An account is the root entity of the user model.Every document belongs to an
 * account.
 */

import mongoose from 'mongoose'
const { Schema } = mongoose

const accountSchema = new Schema({
  /* full name of the account */
  name: {
    type: String,
    unique: true,
    trim: true,
    index: true,
    required: true,
  },

  /* human readable code, which we can use as index */
  code: {
    type: String,
    unique: true,
    index: true,
    trim: true,
    required: true,
    maxLength: 8,
  },

  /* status of the account, e.g  */
  status: { type: String, default: 'active' },
  /* expiration date */
  expires: { type: Date, default: null },
  /* reset key, just in case */
  resetKey: { type: String, default: null },
  /* reset date, just in case */
  resetDate: { type: Date, default: null },

  /* profile */
  profile: {
    /* title */
    title: { type: String, default: null },
    /* subtitle */
    subtitle: { type: String, default: null },
    /* teaser */
    teaser: { type: String, default: null },
    /* description */
    description: { type: String, default: null },
    /* @TODO image, avatar */
  },

  /* notes for administrators */
  note: { type: String, default: null },
})

/* autogenerate timestamps */
accountSchema.set('timestamps', true)

const Account = mongoose.model('ifc_access_account', accountSchema)

export default Account
