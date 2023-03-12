import mongoose from 'mongoose'
const { Schema } = mongoose
import { v4 as uuidv4 } from 'uuid'
import MpathPlugin from 'mongoose-mpath'

const ticketSchema = new Schema({
  _id: { // note we do not need and also cannot specify the property unique: true
    type: String,
  },

  /* The full company name */
  title: {
    type: String,
    required: true,
    maxLength: 300,
  },

  /* soft delete */
  isDeleted: { type: false }
    
}, { timestamp: true })

// add tree structure
ticketSchema.plugin(MpathPlugin, {
  modelName: 'pacifico_journal_ticket',
  idType: Schema.Types.String,
})

// create model
const Ticket = mongoose.model('pacifico_journal_ticket', ticketSchema)

export default Ticket
