import { S } from 'fluent-json-schema'
import { userSchema, userResponseSchema } from '../../model/user/user.schema.js'
import User from '../../model/user/user.model.js'

/*
 * Put user
 */
export default function (app) {

  /* handler */
  async function handler (request, response) {
    try {
      // make sure nobody can overwrite the ID
      delete request.body._id
      let user = await User.findOneAndUpdate({ _id: request.params.id },  request.body, { new: true })
      if (!user) {
        user = await User.create(request.body)
      }
      return user
    } catch (err) {
      app.httpErrors.internalServerError()
    }
  }

  /* params */
  const params = S.object()
    .prop('id', S.string().required())

  /*
   * route options
   */
  return  {
    // constraints: { version: '1.0.0' },
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Update a user.',
      description: `Other than most objects users are created via this dedicated POST
        route. Creating a new user requires some procedures which are best encapsulated 
        in this dedicated API endpoint.`,
      tags: ['core/user'],
      body: userSchema,
      params,
      response: {
        '2xx': userResponseSchema
      },
      security: [ { apiKey: [] } ],
    }
  }
}

