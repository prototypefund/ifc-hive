import mongoose from 'mongoose'
const { Schema } = mongoose
import { v4 as uuidv4 } from 'uuid'


const organizationSchema = new Schema({
  _id: { // note we do not need and also cannot specify the property unique: true
    type: String,
    default: uuidv4(),
  },

  /* The full company name */
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 200,
  },

  /* A shorted version of the company name which everybody understands */
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

  /* tags */
  tags: [String],

  /* soft delete */
  isDeleted: { type: Boolean, default: false },
    
}, { timestamp: true })

const Organization= mongoose.model('pacifico_core_organization', organizationSchema)

export default Organization
