import { S } from 'fluent-json-schema'
import { configTypes } from './configStore.model.js'

const configStoreSchema = S.object()
  .id('#user/uxState')
  .title('core/user/uxstate')
  .prop('_id', S.string())
  .prop('project', S.string())
  .prop('user', S.string())
  .prop('title', S.string())
  .prop('type', S.string().enum(configTypes))
  .prop('config', S.defaults)
  .required(['user', 'type', 'config' ])

export default configStoreSchema
export {
  configStoreSchema
}
