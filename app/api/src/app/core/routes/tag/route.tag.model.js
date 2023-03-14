import * as model from '#src/app/core/model/tag/tag.schema.js'
import { S } from 'fluent-json-schema'

const OPTIONS = ['payload-template', 'raw-template', 'schema']


export default function  handler (app) {

  async function handler (request, response) {
    return {
      template: model.tagTemplate,
      schema: model.tagJsonSchema,
    }
  }

const response = S.object()
  .prop('template', S.default)
  .prop('schema', S.default)

  return {
    handler: handler,
    schema: {
      summary: 'get tag template and schema',
      tags: ['core/tag'],
      response: {
        '2xx': response
      }
    },
  }
}
