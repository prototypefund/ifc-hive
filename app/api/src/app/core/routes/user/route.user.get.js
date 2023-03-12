import { S } from 'fluent-json-schema'
import { userBaseSchema } from './schemas.js'
import User from '../../model/user/user.model.js'

const VERSIONS = ['1.0.0']

export default function (app) {
  /* handler */
  async function handler (request, response) {
    try {
      const user = await User.findOne({ _id: request.params.id })
      return { user }
    } catch (err) {
      app.httpErrors.internalServerError()
    }
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
      summary: 'Get a single user [admin, maintainer, owner]',
      description: `Retrieve a single user, e.g. to edit the object. Only
    administrators, project maintainers and the user himself/herself can access
    this object directly.`,
      tags: ['core/user'],
      // headers,
      params,
      security: [ { apiKey: [] } ],
    },
  }

}
