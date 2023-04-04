import { S } from 'fluent-json-schema'
import { tagResponseSchema } from '../../model/tag/tag.schema.js'
import Tag from '../../model/tag/tag.model.js'

export default function (app) {

  async function handler (request, response) {
    try {
      const tag = await Tag.findOne({ _id: request.params.id })
      if (!tag) return app.httpErrors.notFound()
      return tag
    } catch (err) {
      app.httpErrors.internalServerError()
    }
  }

  /* params scheme */
  const params = S.object()
    .prop('id', S.string())

  /* route options */
  return {
    handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Get a tag by id.',
      tags: ['core/tag'],
      security: [ { apiKey: [] } ],
      params,
      response: {
        '2xx': tagResponseSchema,
      }
    },
  }
}
