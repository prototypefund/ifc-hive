import mongoose from 'mongoose'
const { Schema } = mongoose

const projectSchema = new Schema({
  _id: { // note we do not need and also cannot specify the property unique: true
    type: String,
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

  account: {
    type: Schema.Types.String,
    ref: 'pacifico_core_account',
    default: null,
  },

  /* tags */
  tags: [String],

  /* description */
  description: { type: String },

  /* soft delete */
  isDeleted: { type: false },

  /* Project configs, don't forget to use markedModified['configs'] when updating */
  config: {
    browser: { type: Schema.Types.Mixed, default: {} },
    mobile: { type: Schema.Types.Mixed, default: {} },
  },

  journal: {
    type: Schema.Types.String,
    ref: 'pacifico_journal_ticket',
    default:null,
  }
    
}, { timestamp: true })

const Project = mongoose.model('pacifico_core_project', projectSchema)

export default Project

