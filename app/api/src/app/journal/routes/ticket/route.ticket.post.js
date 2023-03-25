import { S } from 'fluent-json-schema'
import { ticketSchema, ticketResponseSchema } from '../../model/ticket/ticket.schema.js'
import Ticket from '../../model/ticket/ticket.model.js'
import { v4 as uuidv4 } from 'uuid'

/*
 * Post new ticket
 *
 * Since we are operating in a tree, each new tickets needs a parent
 * in the context of a project.
 */

export default function (app) {
  async function handler (req, res) {

    const { parentId, ticketId } = req.params

    try {
      // get parent ticket
      const parent = await Ticket.findOne({ _id: parentId })
      if (!checkTicket) return response.notFound(`Parent ticket ${parentId} doesn't exist.`)

      // create child ticket and pass parent
      const ticket = new Ticket(req.body)
      // avoid tempering by the client and set id's from req.paraams instead of the body 
      ticket.parent = parentId
      ticket._id = ticketId
      await ticket.save()

      return ticket
    } catch (err) {
      app.log.error(err)
      app.httpErrors.internalServerError()
    }
  }

  const params = S.object()
    .prop('parentId', S.string())
    .prop('ticketId', S.string())
    .required(['parentId', 'ticketId'])

  return {
    handler,
    // onRequest: [app.authenticate],
    schema: {
      summary: 'Create a new ticket with a given parent.',
      description: `Create a new ticket given a parent ticket in the scope of the user's permission.`,
      tags: ['journal/ticket'],
      body: ticketSchema,
      params,
      // security: [ { apiKey: [] } ],
    }
  }

}
