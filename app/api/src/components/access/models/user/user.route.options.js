import * as controller from './user.controller.js'
import { removeIdProperty } from '#src/lib/schemaHelpers.js'

export const userSchema = {
  type: 'object',
  required: ['email', 'username'],
  properties: {
    _id: { type: 'string', example: '6267a3b4b9bda6a02226da25' },
    active: { type: 'boolean', example: true },
    blocked: { type: 'boolean', default: false },
    email: { type: 'string', example: 'tony@test.com' },
    email_verified: { type: 'boolean', default: false },
    nickname: { type: 'string', example: 'Tony Test' },
    password: { type: 'string', example: 'mySecret' },
    username: { type: 'string', example: 'tony' },
  },
  optionalProperties: {
    createdAt: { type: 'string', example: '2022-04-26T07:48:04.192Z' },
    passwordUpdated: { type: 'string', example: '2022-04-26T07:48:04.192Z' },
    updatedAt: { type: 'string', example: '2022-04-26T07:48:04.192Z' },
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
  handler: controller.createUser,
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 creates a new user',
    description: 'Adds a new user to the database',
    body: schemaWithoutId,
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    response: { 201: userSchemaComplete },
    security: [{ apiKey: [] }],
  },
}

/* get user collection options */
export const getUsersOptions = {
  constraints: { version: '1.0.0' },
  handler: controller.getUsers,
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
}

/* get single user options */
export const getUserOptions = {
  constraints: { version: '1.0.0' },
  handler: controller.getUser,
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 returns single user by id',
    description: 'Returns a single user object.',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    params: { id: { type: 'string' } },
    response: { 200: userSchemaComplete },
    security: [{ apiKey: [] }],
  },
}

/* update single user options */
export const updateUserOptions = {
  constraints: { version: '1.0.0' },
  handler: controller.updateUser,
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 updates single user by id',
    description: 'Updates a single user object.',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    params: { id: { type: 'string' } },
    body: userSchema,
    response: { 200: userSchemaComplete },
    security: [{ apiKey: [] }],
  },
}

/* delete user options */
export const deleteUserOptions = {
  constraints: { version: '1.0.0' },
  handler: controller.deleteUser,
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 deletes single user by id',
    description: 'Deletes a single user object.',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    params: { id: { type: 'string' } },
    response: { 200: userSchemaComplete },
    security: [{ apiKey: [] }],
  },
}

/* check if username is valid, e.g. unique */
export const validateUsernamOptions = {
  constraints: { version: '1.0.0' },
  handler: controller.validateUsername,
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 checks if username is valid',
    description: 'Checks if username is valid, i.e. unique and a legal string',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    params: { username: { type: 'string' } },
    response: {
      200: { valid: { type: 'boolean' } },
      409: {
        statusCode: { type: 'integer' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  },
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
    body: { email: { type: 'string' } },
    response: {
      200: {
        message: { type: 'string' },
        key: { type: 'string' },
        email: { type: 'string' },
        env: { type: 'string' },
        note: { type: 'string' },
      },
      404: { code: { type: 'integer' }, message: { type: 'string' }, error: { type: 'string' } }
    }
  },

}

/* validate reset key */
export const validateResetToken = {
  constraints: { version: '1.0.0' },
  handler: controller.validateResetToken,
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 checks if a reset token is valid',
    description: 'Checks if a reset token is valid',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    params: { token: { type: 'string' } },
    response: {
      200: { valid: { type: 'boolean' } },
      401: {
        statusCode: { type: 'integer' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  },
}

/* update password with reset key */
export const updatePasswordOptions = {
  constraints: { version: '1.0.0' },
  handler: controller.updatePassword,
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 updates password with reset key',
    description: 'Updates a user\'s password given a valid reset key.',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    body: { token: { type: 'string' }, password: { type: 'string' } },
    response: {
      200: { message: { type: 'string' } },
      401: {
        statusCode: { type: 'integer' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
}

/* verify account / email */
export const verifyEmailOptions = {
  constraints: { version: '1.0.0' },
  handler: controller.verifyEmail,
  schema: {
    tags: ['user'],
    summary: 'v1.0.0 verify email address by token',
    description: 'Verifies a user\'s email address by token after user was first created.',
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    params: { token: { type: 'string' } },
    response: {
      200: { accountActive: { type: 'boolean' } },
      401: {
        statusCode: { type: 'integer' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
}

/* user login options */
export const loginOptions = {
  constraints: { version: '1.0.0' },
  handler: controller.login,
  schema: {
    tags: ['user'],
    body: { password: { type: 'string' }, username: { type: 'string' } },
    headers: { 'Accept-Version': { type: 'string', default: '*' } },
    response: {
      200: { token: { type: 'string' } },
      401: {
        statusCode: { type: 'integer' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
}

/* update avatar */

/* delete avatar */
