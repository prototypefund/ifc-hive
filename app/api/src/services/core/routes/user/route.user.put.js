import { S } from 'fluent-json-schema'
import { userBaseSchema } from './schemas.js'

export default function (app) {
  /* versions */
  const VERSIONS = ['1.0.0']

  /* handler */
  async function handler (request, response) {
    return response.send({
      message: 'objectUpdated',
      requestId: '1234ABFD',
      actionId: null,
      token: request.user,
    })  
  }

  /* body */
  const body = S.object()
    .prop('user', S.oneOf([userBaseSchema.without(['password', 'resetkey'])]))
    .prop('actionid', S.string())

  /* params */
  const params = S.object()
    .prop('id', S.string().required())

  /* query */
  const query = null 

  /* response */
  const response = S.object()
    .prop('message', S.string().examples(['objectUpdated']))
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
  return  {
    constraints: { version: '1.0.0' },
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Update a user [admin, maintainer, owner]',
      description: `Other than with most objects we create a dedicated POST
        route, because user._id is always generated on the server. Creating a new
      user requires some procedures which are best encapsulated in this dedicated
        API endpoint.`,
      tags: ['core/user'],
      body,
      params,
      headers,
      // response: {
      //   '2xx': response
      // },
      security: [ { apiKey: [] } ],
    }
  }
}

