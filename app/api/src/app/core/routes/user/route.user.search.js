import { S } from 'fluent-json-schema'
import { userBaseSchema } from '../../model/user/user.schema.js'

export default function (app) {

  /* handler */
  async function handler (request, response) {
    return response.send({
      message: 'objectUpdated',
      requestId: '1234ABFD',
      actionId: null,
    })  
  }

  /* response */
  const response = S.object()
    .prop('message', S.string().examples(['objectUpdated']))
    .prop('requestId', S.string().examples(['234h34g']))
    .prop('acttionId', S.string().examples(['23498734']))
  // .prop('user', userBaseSchema.without(['password', 'resetkey']))


  /* route options */
  return {
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Search in all users [admin]',
      description: `Users in the search index are fully rendered with populated
    organization, permission and subscription fields.`,
      tags: ['core/user'],
      response: {
        '2xx': response
      },
      security: [ { apiKey: [] } ],
    }
  }
}
