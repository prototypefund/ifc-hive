import mongoose from 'mongoose'
const { Schema } = mongoose
import { v4 as uuidv4 } from 'uuid'


const orgaSchema = new Schema({
  _id: { // note we do not need and also cannot specify the property unique: true
    type: String,
    default: uuidv4(),
  },

  name: {
    type: String,
    required: true,
    unique: true,
  },

  shortname: {
    type: String,
    unique: true,
  },

  code: {
    type: String,
    unique: true,
  }
    
}, { timestamp: true })

const OrgaModel = mongoose.model('ifc_core_organization', orgaschema)

export default OrgaModel


