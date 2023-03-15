import * as model from '#src/app/core/model/project/project.schema.js'
import { S } from 'fluent-json-schema'

export default function projectModelRoute (app) {

  async function handler (request, response) {
    return {
      template: model.projectTemplate,
      schema: model.projectJsonSchema,
    }
  }

const response = S.object()
  .prop('template', S.default)
  .prop('schema', S.default)

  return {
    handler: handler,
    schema: {
      summary: 'Get project template and schema',
      tags: ['core/project'],
      response: {
        '2xx': response
      }
    },
  }

}
