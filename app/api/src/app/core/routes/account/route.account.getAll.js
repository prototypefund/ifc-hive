import { S } from 'fluent-json-schema'
// import { accountResponseSchema } from '../../model/account/account.schema.js'
import Account from '../../model/account/account.model.js'

export default function (app) {
  async function handler (request, response) {
    try {
      const accounts = await Account.find()
      if (!accounts || accounts.length === 0) return response.code(204)
      return { accounts }
    } catch (err) {
      app.httpErrors.internalServerError()
    }
  }

  /* route options */
  return {
    handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Get all or a subset of accounts. Only available to admins.',
      tags: ['core/account'],
      security: [ { apiKey: [] } ],
      // response: {
      //   '2xx': tagResponseSchema,
      // }
    },
  }
}
