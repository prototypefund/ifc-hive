import io from 'socket.io-client'
import log from '@lib/logger.js'

/*
 * createSocket returns an instance of a custom SocketClient
 *
 * @param {string} host - our socket endpoint
 * @return {object} opts - socket.io options
 */
export function createSocket (host, opts) {
  const defaults = {
    // path: '/socket/',
  }
  return io(host, {...defaults, ...opts})
}

/*
 * Register socket events
 *
 * @param {object} $socket - a socketClient instance 
 * @param {object} $store - a minirx-store instance, so we can dispatch actions
 * @param {object} $eventbus - instance of our custom eventbus
 */
export function registerSocketEvents ($socket, $store, $eventbus) {

  let intervalId = false

  /*
   * open event
   * fired every time we have a new connection established
   */
  $socket.on('connect', (data) => {
    log.socket('connected', 'Socket connection established')

    $store.dispatch({ type: 'socket/status', payload: { status: 1, message: 'Connected' } })
    // if we previously tried to connect stop that interval
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = false
    }
  })

  $socket.on('disconnect', () => {
    $store.dispatch({ type: 'socket/status', payload: { status: 0, message: 'disconnect' } })
  })

  $socket.on('reconnect', () => {
    $store.dispatch({ type: 'socket/status', payload: { status: 2, message: 'Reconnect' } })
  })


  /* generic hello event */
  $socket.on('hello', (data) => {
    log.socket('hello', data)
  })

  /* close event */
  $socket.on('close', () => {
    log.socket('close', 'socket connection lost')
  })

  /*
   * login event
   * the server has approved our token
   */
  $socket.on('login', (data) => {
    log.socket('login successful', 'Socket connection successfully authenticated')
  })

 /*
  * timeout event
  * Our continious healthcheck didn't get a response within the expected time from the server
  */
  $socket.on('timeout', (data) => {
    $store.dispatch({ type: 'socket/status', payload: { status: 'Timeout' } })

    log.error('Websocket didn\'t receive pong in expected resonse time', 
      'Socket timeout')

    // @TODO replace with implement of a sane reconnection routine
    setTimeout($socket.reconnect(), 3000) // @TODO
  })

  /*
   * data event
   * We received a data object from the server
   */
  $socket.on('data', (data) => {
    log.socket('update', data)
    // NOTE: always pass array into data/push payload
    $store.dispatch({ type: 'data/push', payload: { data: [data] } })
  })
}

export default createSocket
