import { S } from 'fluent-json-schema'
import { userSchema } from '../../model/user/user.schema.js'
import User from '../../model/user/user.model.js'

export default function (app) {
  async function handler (req, res) {
    try {
      const { id } = req.user
      const user = await User.findOne({ _id: id }).select('-password -resetKey').populate('organization account')
      if (!user) return res.notFound('This token is not valid or the user encoded in the token does not exist.')

      return user
    } catch (err) {
      app.log.error(err)
      app.httpErrors.internalServerError()
    }
  }

  return {
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Get a single user.',
      description: `Retrieve a single user, e.g. to edit the object. Only
    administrators, project maintainers and the user himself/herself can access
    this object directly.`,
      tags: ['core/user'],
      // headers,
      security: [ { apiKey: [] } ]
    },
  }
}
