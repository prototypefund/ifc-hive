export default function websocketRoutes (app, options, done) {
    app.get('/memo', function (request, reply) {
      reply.send({ message: 'Some thing to respond' })
      app.eventbus.emit('memo_get', { _id: 'something' })
    })

  /*
   * Route websocket (generic)
   */
    app.get('/websocket', { websocket: true }, function wsHandler (connection, req) {

      connection.socket.on('message', message => {
        app.log.info({ msg: `Socket recieved message ${message}` })
        connection.socket.send('hi from server')
      })

      app.eventbus.on('memo_get', (payload) => {
        connection.socket.send(JSON.stringify(payload)) 
      })
    })

  /* don't forget to call done */
  done()
}
