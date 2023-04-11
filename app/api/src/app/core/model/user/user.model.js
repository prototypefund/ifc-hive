/*
 * Note Model
 *
 * This files defines the Mongo model for the note object.
 */
import mongoose from 'mongoose'
const { Schema } = mongoose
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { randomIdGenerator } from '#src/lib/helpers.js'
const randomId = randomIdGenerator(64)

const SALT_FACTOR = 10

const userSchema = new Schema({

  _id: { // note we do not need and also cannot specify the property unique: true
    type: String,
    default: uuidv4(),
  },

  nickname: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  organization: {
    type: Schema.Types.String,
    ref: 'pacifico_core_organization',
    default: null,
  },

  account: {
    type: Schema.Types.String,
    ref: 'pacifico_core_account',
    default: null,
  },

  /* title */
  title: { type: String, default: null},

  /* firstname */
  firstname: { type: String, default: null },

  /* lastname */
  lastname: { type: String, default: null },

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

  /* signed terms, we also keep track in the logs of this event */
  signedTerms: { type: Boolean, default: false },

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

  /* tags */
  tags: [String],

  /* soft delete */
  isDeleted: { type: Boolean, default: false },

  /* settings */
  settings: {
    emailSignature: { type: String, default: null },
  },

  ux: {
    lastProjectId: { type: String, default: null },
    browser: { type: Schema.Types.Mixed, default: null},
    project: { type: Map, of: Schema.Types.Mixed, default: {}}
  }

}, { timestamps: true })

/*
 * Pre save
 *
 * Before saving the object we need to hash the password
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
 * Set Password method
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
 * check password method
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
  this.resetKey = randomId()
  return this.resetKey
}

const User = mongoose.model('pacifico_core_user', userSchema)

export default User
