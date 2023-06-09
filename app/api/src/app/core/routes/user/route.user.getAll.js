import { S } from 'fluent-json-schema'
import { userSchema } from '../../model/user/user.schema.js'
import User from '../../model/user/user.model.js'

export default function (app) {

  /* handler */
  async function handler (request, response) {
    try {
      const users = await User.find({})
        .populate('organization account')
        .exec()
      return  { users }
    } catch (err) {
      app.httpErrors.internalServerError()
      app.log.error(err)
    }
  }

  /* route options */
  return {
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Get all or a subset of all users.',
      description: `This API endpoint is only meant for user administration.
        In the context of a project all project-users are provided via the
        socket and retrieving a collection of users should be done via the
        project-search-index.`,
      tags: ['core/user'],
      security: [ { apiKey: [] } ],
    },
  }

}
