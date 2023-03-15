import { S } from 'fluent-json-schema'
import { userSchema } from '../../model/user/user.schema.js'

export default function (app) {

  /* handler */
  async function handler (request, response) {
    return response.send({
      message: 'Placeholder',
      requestId: 'reqeustid',
    })  
  }

  /* response */
  const response = S.object()
    .prop('message', S.string().examples(['objectUpdated']))
    .prop('requestId', S.string().examples(['234h34g']))


  /* route options */
  return {
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: '',
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
