import { S } from 'fluent-json-schema'
import { userBaseSchema } from './schemas.js'

const VERSIONS = ['1.0.0']

/* handler */
async function handler (reqeust, response) {
  return response.send({
    message: 'objectsRetrieved',
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
export const userGetOptions = {
  constraints: { version: '1.0.0' },
  handler: handler,
  schema: {
    summary: 'Get a single user [admin, maintainer, owner]',
    description: `Retrieve a single user, e.g. to edit the object. Only
    administrators, project maintainers and the user himself/herself can access
    this object directly.`,
    tags: ['core/user'],
    headers,
    params,
  },
}

export default userGetOptions
