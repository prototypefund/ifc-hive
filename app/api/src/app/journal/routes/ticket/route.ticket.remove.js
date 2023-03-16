import { S } from 'fluent-json-schema'
import { ticketSchema } from '../../model/ticket/ticket.schema.js'
import Ticket from '../../model/ticket/ticket.model.js'

export default function (app) {
  /* handler */
  async function handler (request, response) {
    try {
      const ticket = await Ticket.findOneAndUpdate(
        { _id: request.params.id }, 
        { isDeleted: true },
        { new: true }) // send use the new document, i.a. after the write operation

      if (!ticket) return app.httpErrors.notFound()
      return  ticket 
    } catch (err) {
      app.httpErrors.internalServerError()
    }
  }

  const params = S.object()
    .prop('id', S.string().required())

  /*
   * route options
   */
  return {
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Delete a ticket and its children by id.',
      description: `Remove a ticket. Note that all child ticket are removed as well`,
      tags: ['journal/ticket'],
      params,
      response: {
        '2xx': ticketSchema
      },
      security: [ { apiKey: [] } ],
    },
  }
}
