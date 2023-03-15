import { S } from 'fluent-json-schema'
import { userSchema } from '../../model/user/user.schema.js'
import User from '../../model/user/user.model.js'


export default function (app) {

  /* handler */
  async function handler (request, response) {
    // create a user by means of test
    try {
      const newUser = await User.create(request.body)
      // return response object
      return newUser
    } catch (err) {
      response.code(500)
      response.send(err)
    }
  }

  /*
   * route options
   */
  return {
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Create a new user.',
      description: `Other than with most objects we create a dedicated POST
      route, because user._id is always generated on the server. Creating a new
    user requires some procedures which are best encapsulated in this dedicated
    API endpoint.`,
      tags: ['core/user'],
      body: userSchema.without(['createdAt', 'isDeleted', 'updatedAt']),
      response: {
        '2xx': userSchema.without(['password', 'resetToken'])
      },
      security: [ { apiKey: [] } ]
    }
  }
}

