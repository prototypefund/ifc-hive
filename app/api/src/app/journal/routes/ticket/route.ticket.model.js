import * as model from '#src/app/journal/model/ticket/ticket.schema.js'
import { S } from 'fluent-json-schema'

export default function ticketModelRoute (app) {
  async function handler (request, response) {
    return {
      template: model.ticketTemplate,
      schema: model.ticketJsonSchema
    }
  }

  const response = S.object()
    .prop('template', S.default)
    .prop('schema', S.default)

  return {
    handler,
    schema: {
      summary: 'Get ticket template and schema',
      tags: ['journal/ticket'],
      response: {
        '2xx': response
      }
    }
  }
}
