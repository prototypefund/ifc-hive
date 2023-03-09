import { S } from 'fluent-json-schema'
import { userBaseSchema } from './schemas.js'

/* versions */
const VERSIONS = ['1.0.0']

/* handler */
async function handler (request, response) {
  return response.send({
    message: 'objectUpdated',
    requestId: '1234ABFD',
    actionId: null,
  })  
}

/* body */
const body = S.object()
  .prop('user', S.anyOf([userBaseSchema.without(['password', 'resetkey'])]))
  .prop('actionid', S.string())

/* params */
const params = null

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
 * Schema
 */
export const userPostOptions = {
  constraints: { version: '1.0.0' },
  handler: handler,
  schema: {
    summary: 'Create a new user',
    description: `Other than with most objects we create a dedicated POST
      route, because user._id is always generated on the server. Creating a new
    user requires some procedures which are best encapsulated in this dedicated
    API endpoint.`,
    tags: ['core/user'],
    body,
    headers,
    response: {
      '2xx': response
    }
  }
}

export default userPostOptions
