import { S } from 'fluent-json-schema'
import { tagResponseSchema, tagSchema } from '../../model/tag/tag.schema.js'
import Tag from '../../model/tag/tag.model.js'

export default function (app) {

  async function handler (request, response) {
    try {
      // make sure nobody can overwrite the ID
      delete request.body._id
      let tag = await Tag.findOneAndUpdate({ _id: request.params.id },  request.body, { new: true })
      if (!tag) {
        tag = await Tag.create(request.body)
      }
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
      summary: 'Create or update a tag with a provided id',
      tags: ['core/tag'],
      security: [ { apiKey: [] } ],
      params,
      body: tagSchema,
      response: {
        '2xx': tagResponseSchema,
      }
    },
  }
}
