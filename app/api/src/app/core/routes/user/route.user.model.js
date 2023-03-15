import * as model from '#src/app/core/model/user/user.schema.js'
import { S } from 'fluent-json-schema'

export default function userModelRoute (app) {

  async function handler (request, response) {
    return {
      template: model.userTemplate,
      schema: model.userJsonSchema,
    }
  }

const response = S.object()
  .prop('template', S.default)
  .prop('schema', S.default)

  return {
    handler: handler,
    schema: {
      summary: 'Get user template and schema',
      tags: ['core/user'],
      response: {
        '2xx': response
      }
    },
  }
}
