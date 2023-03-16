import { S } from 'fluent-json-schema'
import { userResponseSchema } from '../../model/user/user.schema.js'
import User from '../../model/user/user.model.js'

/*
 * Remove user
 */
export default function (app) {
  /* handler */
  async function handler (request, response) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: request.params.id }, 
        { isDeleted: true },
        { new: true })

      if (!user) return app.httpErrors.notFound()
      return  user 
    } catch (err) {
      app.httpErrors.internalServerError()
    }
  }

  const params = S.object()
    .prop('id', S.string().required())

  /*
   * route options
   */
  return {
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Delete a single user by id.',
      description: `Notice that in order to ensure data integrity the systems
    interally handles a soft-delete concept. In order to adhere to the GDPR
    (auf Deutsch DSGVO) the user's attributes may be overwritten with
    pseudo-values.`,
      tags: ['core/user'],
      params,
      response: {
        '2xx': userResponseSchema,
      },
      security: [ { apiKey: [] } ],
    },
  }
}
