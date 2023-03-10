import { S } from 'fluent-json-schema'
import { userBaseSchema } from './schemas.js'
import User from '../../model/user/user.model.js'
import { defaultHeadersSchema } from '#src/lib/headersHelper.js'

export default function (app) {
  /* versions */
  const VERSIONS = ['1.0.0']

  /* handler */
  async function handler (request, response) {
    // create a user by means of test
    try {

      let user = false
      console.log(process.env.API_ROOT_PASSWORD)

      if (request.body.email === process.env.API_ROOT_EMAIL
        && request.body.password === process.env.API_ROOT_PASSWORD
      ) {
        user = {
          email: process.env.API_ROOT_EMAIL,
          id: '0001',
          name: 'Root',
          nickname: 'root',
          sub: '0001',
          firstname: 'Root',
          lastname: 'User',
        }
      } else {
        // attempt to login user against the user collection
        user = await User.findOne({ email: request.body.email })
        // send 401 if we didn't find any user with this email
        if (!user) return app.httpErrors.unauthorized()
        // @TODO  check for blocked and unverified users or password resets
        // if (user.blocked || !user.email_verified) return app.httpErrors.forbidden()

        // check password
        const isCorrectPassword = await user.checkPassword(request.body.password)
        if (!isCorrectPassword) return app.httpErrors.unauthorized()
      }

      // create token
      const payload = {
        email: user.email,
        id: user._id,
        name: `${user.firstname} ${user.lastname}`,
        nickname: user.nickname,
        sub: user._id
      }

      const token = app.jwt.sign(payload)
      const decoded = app.jwt.decode(token)

      // return response object
      return response.send({
        token,
        decoded,
        user,
        requestId: request.id,
        actionId: body.actionId,
      })  
    } catch (err) {
      response.code(500)
      response.send(err)
    }
  }

  /* body */
  const body = S.object()
    .prop('email', S.string().required())
    .prop('password', S.string().required())

  /* headers */
  const headers = defaultHeadersSchema (VERSIONS, VERSIONS.length -1) 

  const response = S.object()
    .prop('token', S.string())
    .prop('decoded', S.default)

  /*
   * route options
   */
  return {
    constraints: { version: '1.0.0' },
    handler: handler,
    schema: {
      summary: 'Request an access token',
      description: `Given a valid username and password this API endpoints
      returns a JWT token to access protected routes.`,
      tags: ['core/user'],
      body,
      headers,
      response: {
        '2xx': response
      }
    }
  }
}
