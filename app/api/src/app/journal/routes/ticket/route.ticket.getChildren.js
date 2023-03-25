import { S } from 'fluent-json-schema'
import { ticketSchema } from '../../model/ticket/ticket.schema.js'
import Ticket from '../../model/ticket/ticket.model.js'

export default function (app) {

  async function handler (req, res) {
    try {
      const rootDoc = await Ticket.findOne({ _id: req.params.id })
      if (!rootDoc) return res.notFound()

      const children = await Ticket.getChildrenTree({ rootDoc })

      return { children: children  }
    } catch (err) {
      app.log.error(err)
      app.httpErrors.internalServerError()
    }
  }

  const params = S.object().prop('id', S.string().required())

  return {
    handler,
    schema: {
      summary: 'Get children of a ticket as list or tree.',
      description: `Get children of a ticket as list or tree
      with various options.`,
      tags: ['journal/ticket'],
      params,
      // security: [ { apiKey: [] } ]
    },
  }

}
