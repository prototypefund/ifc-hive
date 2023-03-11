import { S } from 'fluent-json-schema'
import { userBaseSchema } from './schemas.js'
import User from '../../model/user/user.model.js'

/* versions */
const VERSIONS = ['1.0.0']

export default function (app) {

  /* handler */
  async function handler (request, response) {
    try {
      const users = await User.find()
                              .populate('organization')
                              .exec()
      return { users }
    } catch (err) {
      app.httpErrors.internalServerError()
    }
  }

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
      summary: 'Get all or a subset of all users. [admin]',
      description: `This API endpoint is only meant for user administration. In
    the context of a project all project-users are provided via the socket and
    retrieving a collection of users should be done via the
    project-search-index.`,
      tags: ['core/user'],
      headers,
      security: [ { apiKey: [] } ],
    },
  }

}
