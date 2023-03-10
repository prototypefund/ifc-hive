import mongoose from 'mongoose'
const { Schema } = mongoose
import { v4 as uuidv4 } from 'uuid'


const orgaSchema = new Schema({
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
    maxLength: 20,
  }
    
}, { timestamp: true })

const OrgaModel = mongoose.model('ifc_core_organization', orgaschema)

export default OrgaModel


