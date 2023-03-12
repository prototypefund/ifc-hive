import mongoose from 'mongoose'
const { Schema } = mongoose
import { v4 as uuidv4 } from 'uuid'


const projectSchema = new Schema({
  _id: { // note we do not need and also cannot specify the property unique: true
    type: String,
    default: uuidv4(),
  },

  /* The full company name */
  title: {
    type: String,
    required: true,
    maxLength: 200,
  },

  /* A shorted version of the company name which everybody understands */
  shorttitle: {
    type: String,
    maxLength: 40,
  },

  /* A optional code for the company */
  code: {
    type: String,
    unique: true,
    maxLength: 12,
  },

  /* tags */
  tags: [String],

  /* description */
  description: { type: String },

  /* soft delete */
  isDeleted: { type: false }
    
}, { timestamp: true })

const Project = mongoose.model('pacifico_core_project', projectSchema)

export default Project

