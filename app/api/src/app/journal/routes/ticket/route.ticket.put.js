import { S } from 'fluent-json-schema'
import { ticketSchema, ticketResponseSchema } from '../../model/ticket/ticket.schema.js'
import Ticket from '../../model/ticket/ticket.model.js'
import { v4 as uuidv4 } from 'uuid'

/*
 * Put ticket
 */
export default function (app) {

  /* handler */
  async function handler (request, response) {
    try {
      //  keep reference so we can calculate differences
      const originalTicket = await Ticket.findOne({ _id: request.params.id })
      if (!originalTicket) return response.notFound()

      // make sure nobody can overwrite the ID
      delete request.body._id
      let ticket = await Ticket.findOneAndUpdate({ _id: request.params.id },  request.body, { new: true })
      if (!ticket) {
        ticket = await Ticket.create(request.body)
      }
      // emit update signal for ticket
      app.eventbus.emit('dataUpdate', { type: 'ticket', obj: ticket, prev: originalTicket } )
      return ticket
    } catch (err) {
      app.log.error(err)
      app.httpErrors.internalServerError()
    }
  }

  /* params */
  const params = S.object()
    .prop('id', S.string().required())

  /*
   * route options
   */
  return  {
    // constraints: { version: '1.0.0' },
    handler: handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Update an existing ticket.',
      description: `This is the default route to change any data in a ticket, including meta data of files.`,
      tags: ['journal/ticket'],
      body: ticketSchema,
      params,
      // response: {
      //   '2xx': ticketSchema
      // },
      security: [ { apiKey: [] } ],
    }
  }
}

