import { S } from 'fluent-json-schema'
import Ticket from '../../model/ticket/ticket.model.js'
import fs from 'fs'
import { pipeline } from 'stream'
import util from 'util'

const MODUS = ['web', 'download']
const QUALITY = ['original', 'low', 'medium', 'high' ]

export default function (app) {

  async function handler (req, res) {

    // collect params 
    const { ticketId, fileId } = req.params
    const modus = req.query.modus || MODUS[0]
    const quality = req.query.quality || QUALITY[0]

    // get ticket from database
    const ticket = await Ticket.findOne({ _id: ticketId })
    if (!ticket) return res.notFound(`Ticket ${ticketId} not found`)

    // get requested file from ticket
    const file = ticket.files.find(f => f._id == fileId)
    if (!file || file.length < 1) return res.notFound(`File ${fileId} not found in ticket ${ticketId}`)

    // stream file from path
    // @TODO build path depending on query parameter `quality`
    const path = `${file.path}${file.filename}`
    const stream = fs.createReadStream(path)

    // set header
    res.header('Content-Type', file.mimeType)
    // force download if modus=download
    if (modus === 'download') {
      res.header('Content-disposition', `attachment; filename=${file.originalFilename}`)
    }

    // send reponse
    return res.send(stream)
  }

  /* params */
  const params = S.object()
    .prop('ticketId', S.string().required())
    .prop('fileId', S.string().required())

  const querystring = S.object()
    .prop('modus', S.string().enum(MODUS).default(MODUS[0]))
    .prop('quality', S.string().enum(QUALITY).default(QUALITY[0]))

  return {
    handler, 
    schema: {
      summary: 'Returns a ticket file for download or web-display',
      descriptin: `Given the necessary permissions this endpoint returns a file either for
      download or for web display. Various query-parameters control the desired quality 
      and output-modus.`,
      tags: ['journal/ticket'],
      params,
      querystring,
    }
  }
}
