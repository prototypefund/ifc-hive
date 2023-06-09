import mongoose from 'mongoose'
const { Schema } = mongoose
import { v4 as uuidv4 } from 'uuid'
import MpathPlugin from 'mongoose-mpath'
import { randomIdGenerator } from '#src/lib/helpers.js'
const randomId = randomIdGenerator(8)
import { fileSchema } from './file.schema.js'

/*
 * Ticket schewma
 */
const ticketSchema = new Schema({

  /* id */
  _id: { // note we do not need and also cannot specify the property unique: true
    type: String,
    default: uuidv4(),
  },

  /* ticket belongs to project */
  project: {
    type: Schema.Types.String,
    ref: 'pacifico_core_project',
    required: true,
    immutable: true,
  },

  /*
   * we will need to keep track of some meta-data which is not considered part
   * of the document, e.g.
   */
  meta: {
    /* 
    * keep track of doc size so we can compose reasonably sized socket packages
    * Note that is a only approximate
    */
    doc_size: { type: Number, default: 0 },
    /* in case we send the doc without the file field, we still want to know the file count */
    file_count: { type: Number, default: 0 },
    /* in case we send the doc without the approval field, we still want to know the count */
    approval_count: { type: Number, default: 0 },
    /* allow storage of additional meta information in a map */
    extended: { type:Map }
  },

  /* Ticket title */
  title: {
    type: String,
    // required: true,
    maxLength: 300,
  },

  /* Display ID, a human friendly, auto-incremented ID */
  disId: {
    type: String,
    // immutable: true,
    default: randomId(),
    index: true,
    required: true,
  },

  /* user how owns the ticket, in first place the user who created the ticket */
  owner: {
    type: Schema.Types.String,
    ref: 'pacifico_core_user',
    // required: true,
  },

  /* assigend users */
  assigned: [{ type: Schema.Types.String, ref: 'pacifico_core_user' }],

  /* the actual ticket content */
  body: { type: Schema.Types.Mixed, default: null },

  /* are we done already? */
  closed: { type: Boolean, default: false },

  /* tags, note that label and ticket have to belong to the same project */
  tags: [{ type: Schema.Types.String, ref: 'pacifico_core_tag'}],

  /* start date, e.g. for milestones */
  start: { type: Date, default: null },

  /* due date  */
  due: { type: Date, default: null },

  /* expiration date */
  expires: { type: Date, default: null},

  /* approvals @TODO link to approvals  */
  approvals: { type: Array },

  /* @TODO add file schema */
  files: [fileSchema],

  /* Qualified links, e.g. depends-on, for gantt chart */
  links: { type: Array },

  /* soft delete */
  isDeleted: { type: Boolean, default: false },

  /*
   * Fields added by plug-ins
   *
   * - path
   * - children
   * - parent
   * - updatedAt
   * - createdAt
   */
    
}, { timestamps: true })

/* Add tree structure */
ticketSchema.plugin(MpathPlugin, {
  modelName: 'pacifico_journal_ticket',
  idType: Schema.Types.String,
})

/* create model */
const Ticket = mongoose.model('pacifico_journal_ticket', ticketSchema)

/* exports */
export default Ticket
