import { S } from 'fluent-json-schema'
import { createDataPayload } from '#src/lib/dataObjectHelpers.js'

/* tag base schema */
const tagSchema = S.object()
  .id('#tag/base')
  .title('core/tag')
  .prop('_id', S.string().format('uuid'))
  .prop('project', S.string().format('uuid'))
  .prop('title', S.string().maxLength(100))
  .prop('type', S.string())
  .prop('locked', S.boolean())
  .prop('isDeleted', S.boolean())
  .required(['_id', 'project',  'title'])

/* tag minimal schema */
const tagMinimal = tagSchema.only(['_id', 'project', 'title']) 

const tagResponseSchema = tagSchema

/* raw template */
const tagObjectTemplate = {
  _id: null,
  project: null,
  title: null,
  type: null,
  locked: false,
  isDeleted: false,
}

/* template */
const tagTemplate = createDataPayload({ _source: tagObjectTemplate })

/* Json schema */
const tagJsonSchema = tagSchema.valueOf()

export default tagSchema
export {
  tagSchema,
  tagMinimal,
  tagResponseSchema,
  tagTemplate,
  tagJsonSchema
}

  
