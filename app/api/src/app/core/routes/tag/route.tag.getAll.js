import { S } from 'fluent-json-schema'
import { tagResponseSchema } from '../../model/tag/tag.schema.js'
import Tag from '../../model/tag/tag.model.js'

export default function (app) {

  async function handler (request, response) {
    try {
      const tags = await Tag.find()
      if (!tags || tags.length === 0) return response.code(204)
      return { tags }
    } catch (err) {
      app.httpErrors.internalServerError()
    }
  }

  /* route options */
  return {
    handler,
    // onRequest: [app.authenticate],
    schema: {
      summary: 'Get all or a subset of tags. Usally requested by project.',
      tags: ['core/tag'],
      // security: [ { apiKey: [] } ],
      // response: {
      //   '2xx': tagResponseSchema,
      // }
    },
  }
}
