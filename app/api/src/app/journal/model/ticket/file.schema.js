import mongoose from 'mongoose'
const { Schema } = mongoose
import { v4 as uuidv4 } from 'uuid'

const fileSchema = new Schema({
  /* id */
  _id: {
    type: String,
    default: uuidv4(),
  },
  /* path */
  path: { type: String, default: null },
  /* filename */
  filename: { type: String, required: true, },
  /* encoding */
  encoding: { type: String, default: null },
  /* mimetype */
  mimetype: { type: String, default: null },
  /* extension */
  extension: { type: String, default: null },
  /* originalFilename, as uploaded by the user */
  originalFilename: { type: String, default: null },
  /* size */
  size: { type: Number, default: null },
  /* title */
  title: { type: String, default: null },
  /* caption */
  caption: { type: String, default: null },
  /* description */
  description: { type: String, default: null },
  /* copyright */
  copyright: { type: String, default: null },
  /* source */
  source: { type: String, default: null },
  /* hidden */
  hidden: { type: Boolean, default: false },
  /* stream, e.g. video and audio */
  stream: { type: Boolean, default: false },
  /* duration video and audio */
  duration: { type: Number, default: null },
  /* width images */
  width: { type: Number, default: null },
  /* height, images */
  height: { type: Number, default: null },
  /* tags, simple list of strings */
  tags: [String],
}, { timestamps: true })


export { fileSchema }
