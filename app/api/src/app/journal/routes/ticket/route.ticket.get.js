import { S } from 'fluent-json-schema'
import { ticketSchema } from '../../model/ticket/ticket.schema.js'
import Ticket from '../../model/ticket/ticket.model.js'


export default function (app) {

  async function handler (request, response) {
    try {
      const ticket = await Ticket.findOne({ _id: request.params.id })
      return { ticket }
    } catch (err) {
      app.log.error(err)
      app.httpErrors.internalServerError()
    }
  }

  const params = S.object().prop('id', S.string().required())

  return {
    handler,
    schema: {
      summary: 'Get a single user.',
      description: `Retrieve a single ticket.`,
      tags: ['journal/ticket'],
      params,
      security: [ { apiKey: [] } ]
    },
  }

}
