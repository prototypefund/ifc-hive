import { S } from 'fluent-json-schema'
import { createDataPayload } from '#src/lib/dataObjectHelpers.js'

const projectSchema = S.object()
  .id('#user/base')
  .title('core/user')
  .prop('_id', S.string().format('uuid'))
  .prop('account', S.string().format('uuid'))
  .prop('title', S.string() )
  .prop('shorttitle', S.string(40))
  .prop('code', S.string(12))
  .prop('tags', S.array().items(S.string()))
  .prop('description', S.string())
  .prop('isDeleted', S.boolean())

const projectResponseSchema = projectSchema

const projectObjectTemplate = {}

const projectTemplate = createDataPayload({ _source: projectObjectTemplate })

const projectJsonSchema = projectSchema.valueOf()

export default projectSchema

export {
  projectSchema,
  projectResponseSchema,
  projectTemplate,
  projectJsonSchema,
}
