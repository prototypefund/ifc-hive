import mongoose from 'mongoose'
const { Schema } = mongoose
import { v4 as uuidv4 } from 'uuid'

const tagSchema = new Schema({
  _id: { // note we do not need and also cannot specify the property unique: true
    type: String,
    default: uuidv4(),
  },

  /* The full company name */
  title: {
    type: String,
    required: true,
    unique: true,
    maxLength: 200,
  },

  /* soft delete */
  isDeleted: { type: false }
    
}, { timestamp: true })

const Tag = mongoose.model('pacifico_core_tag', tagSchema)

export default Tag
