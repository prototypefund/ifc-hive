import { aliveHandler, aliveHandlerSchema } from '#src/lib/aliveHandler.js'
import { removeIdProperty } from '#src/lib/schemaHelpers.js'
import * as controller from './account.controller.js'

export const accountSchema = {
  type: 'object',
  required: ['code', 'name'],
  properties: {
    _id: { type: 'string', example: '6267a3b4b9bda6a02226da25' },
    code: { type: 'string', example: 'ICKE' },
    name: { type: 'string', example: 'My Organization' },
    status: {
      type: 'string',
      enum: ['new', 'active', 'archived', 'pending'],
      default: 'active'
    },
    expires: { type: 'string', default: null },
    note: { type: 'string', default: null },
  },
  optionalProperties: {
    createdAt: { type: 'string', example: '2022-04-26T07:48:04.192Z' },
    updatedAt: { type: 'string', example: '2022-04-26T07:48:04.192Z' },
  }
}

const schemaWithoutId = { ...accountSchema }
schemaWithoutId.properties = removeIdProperty(accountSchema.properties)

const accountSchemaComplete = { ...accountSchema }
const { properties, optionalProperties } = accountSchemaComplete
accountSchemaComplete.properties = { ...properties, optionalProperties }

/* create account */
export const createAccountOptions = (app) => {
  return {
    constraints: { version: '1.0.0' },
    handler: controller.createAccount,
    onRequest: [app.authenticate],
    schema: {
      tags: ['account'],
      summary: 'v1.0.0 creates a new account',
      body: schemaWithoutId,
      headers: { 'Accept-Version': { type: 'string', default: '*' } },
      response: { 201: accountSchemaComplete },
      security: [{ apiKey: [] }],
    }
  }
}

/* get account collection */
export const getAccountsOptions = (app) => {}

/* get single account */
export const getAccountOptions = (app) => {}

/* update single account */
export const updateAccountOptions = (app) => {}

/* delete single account */
export const deleteAccountOptions = (app) => {}
