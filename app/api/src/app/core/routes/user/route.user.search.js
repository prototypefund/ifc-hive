import { S } from 'fluent-json-schema'
import { userBaseSchema } from './schemas.js'

/* versions */
const VERSIONS = ['1.0.0']

export default function (app) {
  /* handler */
  async function handler (request, response) {
    return response.send({
      message: 'objectUpdated',
      requestId: '1234ABFD',
      actionId: null,
    })  
  }

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
  return {
    // constraints: { version: '1.0.0' },
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Search in all users [admin]',
      description: `Users in the search index are fully rendered with populated
    organization, permission and subscription fields.`,
      tags: ['core/user'],
      // headers,
      response: {
        '2xx': response
      },
      security: [ { apiKey: [] } ],
    }
  }
}
