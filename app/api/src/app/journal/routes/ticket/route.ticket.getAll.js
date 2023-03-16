import { S } from 'fluent-json-schema'
import { ticketSchema } from '../../model/ticket/ticket.schema.js'
import Ticket from '../../model/ticket/ticket.model.js'

export default function (app) {

  /* handler */
  async function handler (request, response) {
    try {
      const tickets = await Ticket.find({}).limit(100)
      return  { tickets }
    } catch (err) {
      app.httpErrors.internalServerError()
    }
  }

  /* route options */
  return {
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Get all or a subset of all tickets.',
      description: ``,
      tags: ['journal/ticket'],
      security: [ { apiKey: [] } ],
    },
  }

}
