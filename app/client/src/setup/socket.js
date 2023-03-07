import SocketClient from '@lib/socket.js'
import log from './logger.js'

/*
 * createSocket returns an instance of a custom SocketClient
 *
 * @param {string} socketEndpoint - our default socket enpdoint
 * @return {object} socket - returns an instance of SocketClient
 */
export function createSocket (socketEndpoint) {
  // create socket
  const socket = new SocketClient()
  socket.connect(socketEndpoint)

  return socket
}

/*
 * Register socket events
 *
 * @param {object} $socket - a socketClient instance 
 * @param {object} $store - a minirx-store instance, so we can dispatch actions
 * @param {object} $eventbus - instance of our custom eventbus
 */
export function registerSocketEvents (socket, $store, $eventbus) {

  let intervalId = false

  /*
   * open event
   * fired every time we have a new connection established
   */
  socket.on('open', (data) => {
    log.socket('Socket connection established', 'connected')
    
    // if we previously tried to connect stop that interval
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = false
    }
  })

  /*
   * close event
   */
  socket.on('close', (data) => {
    log.socket('socket connection lost', 'closed')

    // @TODO replace with implement of a sane reconnection routine
    setTimeout(socket.reconnect(), 3000)  
  })

  /*
   * login event
   * the server has approved our token
   */
  socket.on('login', (data) => {
    log.socket('Socket connection successfully authenticated', 'login successful')
  })

 /*
  * timeout event
  * Our continious healthcheck didn't get a response within the expected time from the server
  */
  socket.on('timeout', (data) => {
    log.error('Websocket didn\'t receive pong in expected resonse time', 
      'Socket timeout')

    // @TODO replace with implement of a sane reconnection routine
    setTimeout(socket.reconnect(), 3000) // @TODO
  })


  /* id event, we have received our socket id from the server */
  socket.on('id', (data) => {
    log.socket({ msg: `Received socket ID ${data.id}`, data }, 'id')
    socket.id = data.id
  })

  /*
   * data event
   * We received a data object from the server
   */
  socket.on('data', (data) => {
    log.socket(data, 'update')
    // NOTE: always pass array into data/push payload
    $store.dispatch({ type: 'data/push', payload: { data: [data.data] } })
  })
}

export default createSocket
