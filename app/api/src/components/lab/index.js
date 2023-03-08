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
    app.eventbus.emit('push_data', updatedObject )
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
  app.get('/websocket', { websocket: true }, function wsHandler (connection, req) {
    // create a unique ide for this socket
    const id = nanoid()
    connection.socket.id = id

    // send unique socket id to client
    app.log.info(`Socket ${connection.socket.id} connected`)
    connection.socket.send(JSON.stringify({ type: 'id', params: { id } }))

    /* connection closed event */
    connection.socket.on('close', message => {
      app.log.info(`Socket ${connection.socket.id} closed`)
    })

    /* Message event, handle depending on the object type (memo, user, etc.) */
    connection.socket.on('message', message => {
      // lets make sure we turn buffers into strings
      const raw = typeof message === 'string'? message : message.toString()
      try {
        const data = JSON.parse(raw)

        // handle message depending on type
        switch (data.type) {
            // answer with a pong when receiving a ping
          case 'ping': 
            const payload = { type: 'pong', params: { token: data.params.token } }
            connection.socket.send(JSON.stringify(payload))
            break
          default:
            app.log.error({ msg: `Socket server unknown message type ${data.type}`, data })
        }

      } catch (error) {
        app.log.error({ msg: 'Socket server cannot parse message', data: raw })
      }
    })

    /* Push data to client */
    app.eventbus.on('push_data', (payload) => {
      app.log.info({ msg: 'Push data to socket', item: payload._id  })
      // build message in required format
      const message = { type: 'data', params: { data: payload } } 
      // send message to client
      connection.socket.send(JSON.stringify(message)) 
    })

  })

} 
