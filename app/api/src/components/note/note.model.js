/*
 * Note Model
 *
 * This files defines the Mongo model for the note object.
 */
import mongoose from 'mongoose'
const { Schema } = mongoose

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
})

const Note = mongoose.model('note', noteSchema)

export default Note
