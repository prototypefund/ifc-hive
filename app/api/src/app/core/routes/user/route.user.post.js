import { S } from 'fluent-json-schema'
import { userBaseSchema } from './schemas.js'
import User from '../../model/user/user.model.js'


export default function (app) {
  /* versions */
  const VERSIONS = ['1.0.0']

  /* handler */
  async function handler (request, response) {
    // create a user by means of test
    try {
      const newUser = await User.create(request.body.user)
      // return response object
      return response.send({
        message: `objectUpdated`,
        user: newUser,
        requestId: '1234ABFD',
        actionId: null,
      })  
    } catch (err) {
      response.code(500)
      response.send(err)
    }

  }

  /* body */
  const body = S.object()
    .prop('user', userBaseSchema.without(['resetkey']))
    .prop('actionid', S.string())

  /* params */
  const params = null

  /* query */
  const query = null 

  /* response */
  const response = S.object()
    .prop('message', S.string().examples(['objectUpdated']))
    .prop('user', userBaseSchema.without(['password', 'resetToken']))
    .prop('requestId', S.string().examples(['234h34g']))
    .prop('acttionId', S.string().examples(['23498734']))
  // .prop('user', userBaseSchema.without(['password', 'resetkey']))

  /* headers */
  const headers = S.object()
    .prop('Accept-Version', S.string().enum(VERSIONS).default(VERSIONS[VERSIONS.length - 1]))
    .required('Accept-Version')

  /*
   * route options
   */
  return {
    constraints: { version: '1.0.0' },
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Create a new user [admin]',
      description: `Other than with most objects we create a dedicated POST
      route, because user._id is always generated on the server. Creating a new
    user requires some procedures which are best encapsulated in this dedicated
    API endpoint.`,
      tags: ['core/user'],
      body,
      headers,
      response: {
        '2xx': response
      },
      security: [ { apiKey: [] } ]
    }
  }
}

