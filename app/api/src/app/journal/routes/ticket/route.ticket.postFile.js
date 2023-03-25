import { S } from 'fluent-json-schema'
import Ticket from '../../model/ticket/ticket.model.js'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { stat } from 'fs/promises'
import { pipeline } from 'stream'
import util from 'util'
import { randomIdGenerator } from '#src/lib/helpers.js'

const randomId = randomIdGenerator(32)

const pump = util.promisify(pipeline)

export default function (app) {

  /* handler */
  async function handler (request, response) {
    // get data from upload
    const data = await request.file()
    const { filename, encoding, mimetype } = data

    // get ticket from database
    const ticket = await Ticket.findOne({ _id: request.params.id })
    if (!ticket) return response.notFound()

    // build new file representation @TODO publish to project directory
    const newFile = {
      path: `/opt/pacifico/journal/`,
      filename: randomId(),
      encoding,
      mimetype,
      extension: filename.split('.').pop(),
      originalFilename: filename,
      size: null,
    }

    try {
      // write the upload stream to disk
      await pump(data.file, fs.createWriteStream(`${newFile.path}${newFile.filename}`))
      // get the size of the file
      const fileStats = await stat(`${newFile.path}${newFile.filename}`)
      newFile.size = fileStats.size
      // save the new file representation to the ticket and save the ticket
      ticket.files.push(newFile)
      await ticket.save()

      // return the object representing the new file
      return ticket.files[ticket.files.length - 1]
    } catch (err) {
      app.log.error(err)
      app.httpErrors.internalServerError()
    }
  }

  /* params */
  const params = S.object()
    .prop('id', S.string().required())

  return {
    handler,
    onRequest: [app.authenticate],
    schema: {
      summary: 'Uplodate an attachment to a ticket',
      description: `Expects a single file filed named 'attachment' and attaches the incoming
      file to the ticket by representing it in the 'files' array.`,
      security: [ { apiKey: [] } ],
      tags: ['journal/ticket'],
      params,
    }
  }
}
