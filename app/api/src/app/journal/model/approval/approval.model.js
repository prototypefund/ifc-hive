import mongoose from 'mongoose'
const { Schema } = mongoose
import { v4 as uuidv4 } from 'uuid'

const approvalSchema = new Schema({

  _id: {
    type: String,
    default: uuidv4(),
  },

  owner: {
    type: Schema.Types.String,
    ref: 'pacifico_core_user',
    required: true,
  },

  assigned: {
    type: Schema.Types.String,
    ref: 'pacifico_core_user',
    default: null,
    required: true,
  },

  answerValue: { type: Boolean, default: null },
  answerDate: { type: Date, default: null },
  answerIP: { type: String, default: null },
  answerTicket: { type: String, default: null },
  answerComment: { type: String, default: null },
  subject: { type: String, default: null },
  message: { type: String, default: null },
  code: { type: String, default: null },
  due: { type: Date, default: null },
  expires: { type: Date, default: null },
  confidential: { type: Boolean, default: null },
}, { timestamp: true })
