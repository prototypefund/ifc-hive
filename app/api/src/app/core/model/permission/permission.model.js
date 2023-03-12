import mongoose from 'mongoose'
const { Schema } = mongoose
import { v4 as uuidv4 } from 'uuid'
import { randomIdGenerator } from '#src/lib/helpers.js'


const permissionSchema = new Schema({
  _id: { // note we do not need and also cannot specify the property unique: true
    type: String,
    default: uuidv4(),
  },

  /*
   * type
   * permission, subscription, admin
   */
  type: { type: String, default: null },

  /* A optional code for the company */
  code: { type: String, unique: true, default: randomIdGenerator(64)() },

  // /* subject ID who is this permission for? */
  subjectId: { type: String, default: null, required: true },
  //
  // /* what kind of entity is this? user, account? */
  subjectType: { type: String, default: null, required: true },
  //
  // /* which object does the permission refer? */
  objectId: { type: String, default: null, required: true },
  //
  // /* what kiind of object is the target object? */
  objectType: { type: String, default: null, required: true },
  //
  // /* when does the ermission expire? */
  expires: { type: Date, default: null },
  //
  // /* our permission value as integer, which we will use in a bit-wise fashion */
  value: { type: Number, default: 0 },
    
}, { timestamp: true })

const Permission = mongoose.model('pacifico_core_permission', permissionSchema)

export default Permission
