/**
 * Karo User Model
 *
 * This class represents a system user entity to the app
 */
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema } = mongoose

const SALT_FACTOR = 10

const userSchema = new Schema({
  /* username must be unique */
  username: {
    type: String,
    unique: true,
  },

  /* nickname is displayed in the app to other users */
  nickname: {
    type: String,
    default: null,
    trim: true,
  },

  /* email must be unique */
  email: {
    type: String,
    unique: true,
  },

  /* is the email address yet verified? */
  email_verified: { type: Boolean, default: false },

  /* is the user account active? */
  active: { type: Boolean, default: true },

  /* is the user blocked? */
  blocked: { type: Boolean, default: false },

  /* hashed password field */
  password: { type: String, trim: true },

  /* keep track of last password update */
  passwordUpdated: { type: Date, default: null },

  /* reset key, required when user needs to reset password */
  resetKey: {
    type: String,
    index: true,
    default: null,
    unique: true,
  },

  /*
   * we need to keep track of last reset request, as the key should only be valid
   * for a certain time
   */
  resetDate: { type: Date, default: null },

  /* settings */
  settings: {
    emailSignature: { type: String, default: null },
    accessNotification: { type: Number, default: 1 },
    downloadNotification: { type: Number, default: 1 },
  },
  /* profile, additional user information */
  // avatar: { type: fileSchema, default: null },

  // roles: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'karo_user_roles',
  //   default: null,
  // }],
  //
  // account: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'karo_user_accounts',
  // },
})

/*
 * Pre save
 */
userSchema.pre('save', function (done) {
  // do we have apassword at all?
  if (!this.isModified('password') || this.password === undefined || !this.password || this.password === null) {
    this.setResetKey()
    return done()
  }

  // do we need to set the restPassword key? As it is unique, mongo needs some
  // value to prevent multiple documents from having null
  if (!this.resetKey || this.resetKey === '') { this.setResetKey() }
  // generate hash
  bcrypt.genSalt(SALT_FACTOR)
    // generate hash
    .then(salt => bcrypt.hash(this.password, salt))
    // save hash to password field
    .then((hash) => {
      this.password = hash
      done()
    })
    // catch errors
    .catch((error) => {
      throw new Error(error)
    })
  return true
})

/*
 * Set Password
 */
userSchema.methods.setPassword = function (password) {
  return new Promise((resolve, reject) => {
    if (!password) {
      this.password = false
      resolve(false)
    }
    bcrypt.genSalt(SALT_FACTOR)
    // generate hash
      .then(salt => bcrypt.hash(password, salt))
      .then((hash) => {
        this.password = hash
        resolve(hash)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

/*
 * check password
 */
userSchema.methods.checkPassword = function (guess) {
  return new Promise((resolve) => {
    bcrypt.compare(guess, this.password)
      .then((result) => {
        resolve(result)
      })
  })
}

/*
 * set Reset Key
 * In case the user needs to reset his password, we need a temporary key
 */
userSchema.methods.setResetKey = function () {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  // generate the key
  for (let i = 0; i < 32; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  this.resetKey = text
  return this.resetKey
}

/* auto generate timestamps fields for creation and modification dates */
userSchema.set('timestamps', true)

const User = mongoose.model('ifc_access_user', userSchema)

export default User
