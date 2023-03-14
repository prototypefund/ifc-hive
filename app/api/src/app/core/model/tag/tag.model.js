import mongoose from 'mongoose'
const { Schema } = mongoose
import { v4 as uuidv4 } from 'uuid'

const tagTypes = [
  'time',
  'status',
]

const tagSchema = new Schema({
  _id: { // note we do not need and also cannot specify the property unique: true
    type: String,
    default: uuidv4(),
  },

  /* tags always belong to a project */
  project: {
    type: Schema.Types.String,
    ref: 'ifc_core_project',
    default: null,
  },

  /* the actual tag content */
  title: {
    type: String,
    required: true,
    maxLength: 200,
  },

  /* mil */
  type: {
    type: String,
    maxLength: 50,
    default: null,
  },

  /* we want to discriminate project tags from simple user tags */
  locked: {
    type: Boolean, 
    default: false,
  },

  /* soft delete */
  isDeleted: { type: false }
    
}, { timestamp: true })

const Tag = mongoose.model('pacifico_core_tag', tagSchema)

export default Tag
export { tagSchema, Tag, tagTypes  }
