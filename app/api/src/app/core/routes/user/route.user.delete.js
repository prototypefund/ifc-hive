import { S } from 'fluent-json-schema'
import { userBaseSchema } from './schemas.js'

const VERSIONS = ['1.0.0']

export default function (app) {
  /* handler */
  async function handler (request, response) {
    return response.send({
      message: 'objectDeleted',
      requestId: '1235',
      actionId: '234',
    })
  }

  const params = S.object()
    .prop('id', S.string().required())

  /* headers */
  const headers = S.object()
    .prop('Accept-Version',
      S.string().enum(VERSIONS).default(VERSIONS[VERSIONS.length - 1]))
    .required('Accept-Version')

  /*
   * route options
   */
  return {
    // constraints: { version: '1.0.0' },
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Delete a single user [admin, maintainer, owner]',
      description: `Notice that in order to ensure data integrity the systems
    interally handles a soft-delete concept. In order to adhere to the GDPR
    (auf Deutsch DSGVO) the user's attributes may be overwritten with
    pseudo-values.`,
      tags: ['core/user'],
      // headers,
      params,
      security: [ { apiKey: [] } ],
    },
  }
}
