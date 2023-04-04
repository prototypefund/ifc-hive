import { S } from 'fluent-json-schema'
import { userSchema, userResponseSchema } from '../../model/user/user.schema.js'
import User from '../../model/user/user.model.js'

export default function (app) {

  async function handler (req, res) {

    const user = await User.findOneAndUpdate(
      { _id: req.user._id }, // filter
      { 'ux.lastProjectId': req.params.projectId }, // update fields
      { new: true  }) // return new object
    return user
  }

  /* params */
  const params = S.object()
    .prop('projectId', S.string().required())

  return  {
    // constraints: { version: '1.0.0' },
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Set last accessed project for given user',
      description: `Takes the user in the provided token and writes the given
        project id into the user's UX config`,
      tags: ['core/user'],
      params,
      // response: {
      //   '2xx': userResponseSchema
      // },
      security: [ { apiKey: [] } ],
    }
  }
}
