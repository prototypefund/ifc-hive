import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
const { Schema } = mongoose

const configTypes = [
  'lastRoute', 'projectConfig', 'search'
]

const configStoreSchema = new Schema({
  _id: { // note we do not need and also cannot specify the property unique: true
    type: String,
    default: uuidv4(),
  },

  /* project reference */
  project: {
    type: Schema.Types.String,
    ref: 'pacifico_core_project',
    default: null,
  },

  /* user reference */
  user: {
    type: Schema.Types.String,
    ref: 'pacifico_core_user',
    required: true,
  },

  /* user specified type */
  title: {
    type: String,
    default: null,
  },

  /* config type */
  type: {
    type: String,
    enum: configTypes,
  },

  /* config value */
  config: {
    type: Schema.Types.Mixed,
    required: true,
  },
}, { timestamps: true })

const ConfigStore = mongoose.model('pacifico_core_configStore', configStoreSchema )

export default ConfigStore
export { configStoreSchema, ConfigStore, configTypes }

