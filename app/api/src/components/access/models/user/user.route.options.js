import * as controller from './user.controller.js'
import { removeIdProperty } from '#src/lib/schemaHelpers.js'

export const userSchema = {
  type: 'object',
  required: ['email', 'username'],
  properties: {
    _id: { type: 'string' },
    blocked: { type: 'boolean' },
    email: { type: 'string' },
    email_verified: { type: 'boolean' },
    nickname: { type: 'string' },
    password: { type: 'string' },
    username: { type: 'string' },
  },
  optionalProperties: {
    createdAt: { type: 'string' },
    passwordUpdated: { type: 'string' },
    updatedAt: { type: 'string' },
  }
}

/* when creating a new object we don't expect an _id field in the body */
const schemaWithoutId = { ...userSchema }
schemaWithoutId.properties = removeIdProperty(userSchema.properties)

/* the reponse also includes the optional fields */
const userSchemaComplete = { ...userSchema }
const { properties, optionalProperties } = userSchemaComplete
userSchemaComplete.properties = { ...properties, ...optionalProperties }
const { password, ...userSchemaWithoutPassword } = userSchemaComplete.properties
userSchemaComplete.properties = userSchemaWithoutPassword

/* create user options */
export const addUserOtions = {
  constraints: { version: '1.0.0' },
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 creates a new user',
    description: 'Adds a new user to the database',
    body: schemaWithoutId,
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    response: { 201: userSchemaComplete },
    security: [{ apiKey: [] }],
  },
  handler: controller.createUser
}

/* get user collection options */
export const getUsersOptions = {
  constraints: { version: '1.0.0' },
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 returns user collection',
    description: 'Returns user collection',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    response: {
      200: {
        type: 'array',
        items: userSchemaComplete
      }
    },
    security: [{ apiKey: [] }],
  },
  handler: controller.getUsers,
}

/* get single user options */
export const getUserOptions = {
  constraints: { version: '1.0.0' },
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 returns single user by _id',
    description: 'Returns a single user object.',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    params: { id: { type: 'string' } },
    response: { 200: userSchemaComplete },
    security: [{ apiKey: [] }],
  },
  handler: controller.getUser,
}

/* update single user options */
export const updateUserOptions = {
  constraints: { version: '1.0.0' },
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 updates single user by _id',
    description: 'Updates a single user object.',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    params: { id: { type: 'string' } },
    body: userSchema,
    response: { 200: userSchemaComplete },
    security: [{ apiKey: [] }],
  },
  handler: controller.updateUser
}

/* delete user options */
export const deleteUserOptions = {
  constraints: { version: '1.0.0' },
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 deletes single user by _id',
    description: 'Deletes a single user object.',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    params: { id: { type: 'string' } },
    response: { 200: userSchemaComplete },
    security: [{ apiKey: [] }],
  },
  handler: controller.deleteUser
}

/* check if username is valid, e.g. unique */
export const validateUsernamOptions = {
  constraints: { version: '1.0.0' },
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 checks if username is valid',
    description: 'Checks if username is valid',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    params: { username: { type: 'string' } },
    security: [{ apiKey: [] }],
    response: {
      200: { valid: { type: 'boolean' } },
      409: {
        statusCode: { type: 'integer' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  },
  handler: controller.validateUsername
}

/* password forgotten */
export const passwordForgottenOptions = {
  constraints: { version: '1.0.0' },
  handler: controller.resetPassword,
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 request reset of password',
    description: 'Given a user\'s email, a reset token is generated and sent to the user\'s email address.',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    // body: { email: { type: 'string' } },
    response: {
      200: { message: { type: 'string' } },
      404: { code: { type: 'integer' }, message: { type: 'string' }, error: { type: 'string' } }
    }
  },

}

/* validate reset key */
export const validateResetToken = {
  constraints: { version: '1.0.0' },
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 checks a reset token is valid',
    description: 'Checks if a reset token is valid',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    params: { token: { type: 'string' } },
    security: [{ apiKey: [] }],
    response: {
      200: { valid: { type: 'boolean' } },
      401: {
        statusCode: { type: 'integer' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  },
  handler: controller.validateResetToken
}

/* update password with reset key */
export const updatePassword = {
}

/* update avatar */

/* delete avatar */
