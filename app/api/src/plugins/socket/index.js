import fp from 'fastify-plugin'
import { Server } from 'socket.io'

export default fp(async function(app, opts) {

  const defaults = {
    cors: false,
    connectionTimeout: 45000,
    pingInterval: 25000,
    pingTimeout: 20000
  }

  /* 
   * create and configure the websocket  server
   * @TODO add options from env variables 
   */
  const wss = new Server(app.server, {...defaults, ...opts })

  // make the websocket server available in the whole app
  app.decorate('wss', wss)
  
  // close the websocket server when the http server is closing
  app.addHook('onClose', (app, done) => {
    app.log.warn('App is closing, socket connection is also cloesd')
    app.wss.close()
    done()
  })
})
