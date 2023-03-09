import { S } from 'fluent-json-schema'
import { userBaseSchema } from './schemas.js'

/* versions */
const VERSIONS = ['1.0.0']

/* handler */
async function handler (reqeust, response) {
  return response.send({
    message: 'objectsRetrieved',
    requestId: '1235',
    actionId: '234',
    count: 24,
  })
}

/* headers */
const headers = S.object()
  .prop('Accept-Version', S.string().enum(VERSIONS).default(VERSIONS[VERSIONS.length - 1]))
  .required('Accept-Version')


/*
 * route options
 */
export const usersGetOptions = {
  constraints: { version: '1.0.0' },
  handler: handler,
  schema: {
    summary: 'Get all or a subset of all users. [admin]',
    description: `This API endpoint is only meant for user administration. In
    the context of a project all project-users are provided via the socket and
    retrieving a collection of users should be done via the
    project-search-index.`,
    tags: ['core/user'],
    headers,
  },
}

export default usersGetOptions
