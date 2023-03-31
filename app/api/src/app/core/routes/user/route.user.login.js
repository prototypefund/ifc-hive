/*
 * User Login route 
 *
 * Provied some valid user credentials (username/password) this routes returns
 * a JWT token. 
 */
import { S } from 'fluent-json-schema'
import { userSchema} from '../..//model/user/user.schema.js'
import User from '../../model/user/user.model.js'
import { defaultHeadersSchema } from '#src/lib/headersHelper.js'
import { randomIdGenerator } from '#src/lib/helpers.js'
const randomId = randomIdGenerator(16)

/*
 * POST user login
 */
export default function (app) {

  /* handler */
  async function handler (request, response) {
    // create a user by means of test
    try {

      let user = false

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
        console.log(user.password)
        // send 401 if we didn't find any user with this email
        if (!user) return app.httpErrors.unauthorized()

        // do not grant access under the following conditions
        if (user.blocked || !user.email_verified)
          return app.httpErrors.forbidden()

        // @TODO notify user when there is an active reset token
        // if (user.reset_token) ...

        // check password
        try {
          const isCorrectPassword = await user.checkPassword(request.body.password)
          if (!isCorrectPassword) return app.httpErrors.unauthorized()
        } catch (err) {
          app.httpErrors.forbidden()
          app.log.error(err)
        }
      }

      // create token
      const payload = {
        email: user.email,
        id: user._id,
        name: `${user.firstname} ${user.lastname}`,
        nickname: user.nickname,
        sub: user._id,
      }

      // add token id to payload
      payload.tokenId = randomId()

      // sign the token
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

  const response = S.object()
    .prop('token', S.string())
    .prop('decoded', S.default)
    .prop('user', userSchema.without(['password', 'resetToken', 'blocked', 'email_verified']))

  /*
   * route options
   */
  return {
    handler: handler,
    schema: {
      summary: 'Request an access token given valid email/password credentials. ',
      description: `Given a valid username and password this API endpoints
      returns a JWT token to access protected routes.`,
      tags: ['core/user'],
      body,
      response: {
        '2xx': response
      }
    }
  }
}
