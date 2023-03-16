import { S } from 'fluent-json-schema'
import { userSchema } from '../../model/user/user.schema.js'
import User from '../../model/user/user.model.js'

export default function (app) {
  /* handler */
  async function handler (request, response) {
    try {
      const user = await User.findOne({ _id: request.params.id })
      return { user }
    } catch (err) {
      app.httpErrors.internalServerError()
    }
  }

  const params = S.object().prop('id', S.string().required())

  /*
   * route options
   */
  return {
    // constraints: { version: '1.0.0' },
    handler: handler,
    schema: {
      summary: 'Get a single user.',
      description: `Retrieve a single user, e.g. to edit the object. Only
    administrators, project maintainers and the user himself/herself can access
    this object directly.`,
      tags: ['core/user'],
      // headers,
      params,
      security: [ { apiKey: [] } ]
    },
  }

}
