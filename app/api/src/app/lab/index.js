/*
 * lab routes
 *
 * This file contains some routes to test the api and socket communication with
 * the client.
 *
 * @TODO remove this file once the actual model routes are in place
 */
import { nanoid } from 'nanoid'
import { S } from 'fluent-json-schema'

export default async function (app) {

  /* build GET memo schema */
  const memoGetParamsSchema = S.object()
    .prop('id', S.string().examples(['2324234098234', 'memo-234']))

  const memoGetSchema = {
    schema: {
      params: memoGetParamsSchema
    }
  }


  /*
   * GET Memo
   */
  app.get('/memo/:id', memoGetSchema , function (request, reply) {
    reply.send({ message: 'Some thing to respond' })
    app.eventbus.emit('memo_get', { _id: 'something' })
  })

  /*
   * POST Memo
   */
  app.post('/memo', function (request, reply) {
    reply.send({ message: 'Some thing to respond' })
    app.eventbus.emit('memo_get', { _id: 'something' })
  })

  /*
   * PUT Memo
   */
  app.put('/memo/:id', function (request, reply) {
    reply.send({ message: 'Some thing to respond' })

    // @TODO update item
    const updatedObject = JSON.parse(JSON.stringify(request.body))

    // add display ID if we don't have one yet
    if (!updatedObject._disId || updatedObject._disId.length > 6) {
      updatedObject._disId = nanoid(6)
    }

    // update modifed field
    updatedObject._modified = new Date()
    // make sure the object id exissts in _source
    updatedObject._source._id = request.params.id

    /* Mock update depending on object type */
    switch (updatedObject._type) {
      case 'user':
        let { firstname, lastname, email } = updatedObject._source
        updatedObject._title = `${firstname} ${lastname} ${email}`
        break
      case 'memo':
        updatedObject._title = updatedObject._source.title
        break
      case 'tag':
        updatedObject._title = updatedObject._source.title
        break
      case 'organization':
        let { name, shortname } = updatedObject._source
        updatedObject._title = `${shortname} ${name}`
        break
      case 'project': 
        updatedObject._title = updatedObject._source.title
        break
      default: 
    }

    // push updated object into event bus, which pushes it via socket to the client
    app.eventbus.emit('dataUpdate', updatedObject )
  })

  /*
   * DELETE Memo
   */
  app.delete('/memo/:id', function (request, reply) {
    reply.send({ message: 'Some thing to respond' })
  })

  /* 
   * GET websocket
   */
  // app.get('/websocket', { websocket: true }, function wsHandler (connection, req) {
  //
  //   /* Push data to client */
  //   app.eventbus.on('push_data', (payload) => {
  //     app.log.info({ msg: 'Push data to socket', item: payload._id  })
  //     // build message in required format
  //     const message = { type: 'data', params: { data: payload } } 
  //     // send message to client
  //     connection.socket.send(JSON.stringify(message)) 
  //   })
  //
  // })

} 
