import { aliveHandler } from '#src/lib/aliveHandler.js'

import * as ticket from './routes/ticket/index.js'

export default async function (app) {
  
  app.get('/ticket/model', ticket.model(app))
  app.get('/tickets', ticket.getAll(app))
  app.get('/ticket/:id', ticket.get(app))
  app.delete('/ticket/:id', ticket.remove(app))
  app.put('/ticket/:id', ticket.put(app))
  app.post('/ticket/:id/files', ticket.postFile(app))
  app.get('/ticket/:ticketId/file/:fileId', ticket.getFile(app))
  app.post('/ticket/:parendId/children/:ticketId', ticket.post(app))
  app.get('/ticket/:id/children', ticket.getChildren(app))
}
