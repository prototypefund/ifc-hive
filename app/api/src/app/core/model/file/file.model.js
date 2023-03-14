
/**
 * File Schema
 */
import mongoose from 'mongoose';

const fileSchema = mongoose.Schema({

  /*
   * @type {string} - avatar, memo, generic document
   */
  filetype: { type: String, default: null },
  /* @type {string} */
  originalname: { type: String, default: null },
  /* @type {string} */
  previewname: { type: String, default: null },
  /* @type {string} */
  encoding: { type: String, default: null },
  /* @type {string} */
  mimetype: { type: String, default: null },
  /* @type {string} */
  destination: { type: String, default: null },
  /* @type {string} */
  filename: { type: String, default: null },
  /* @type {string} */
  path: { type: String, default: null },
  /* @type {Number} */
  size: { type: Number, default: null },
  /* @type {Number} */
  duration: { type: Number, default: null },
  /* @type {Number} */
  width: { type: Number, default: null },
  /* @type {Number} */
  height: { type: Number, default: null },
  /* @type {object} */
  title: { type: String, default: null },
  /* @type {object} */
  caption: { type: String, default: null },
  /* @type {object} */
  description: { type: String, default: null },
  /* @type {string} */
  copyright: { type: String, default: null },
  /* @type {number} */
  position: { type: Number, default: 0 },
  /* @type {String} */
  source: { type: String, default: null },
  /* @type {Boolean} */
  publish: { type: Boolean, default: true },
  /* @type {Boolean} */
  hidden: { type: Boolean, default: false },
  /* @type {Boolean} */
  stream: { type: Boolean, default: false },

});

export default fileSchema;
