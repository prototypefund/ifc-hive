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

  /* Report open event */
  socket.on('open', (data) => {
    log.socket('Socket connection established', 'connected')
    console.dir(socket)
  })

  /* Report when id was received */
  socket.on('id', (data) => {
    log.socket({ msg: `ReCeived socket ID ${data.id}`, data }, 'id')
    socket.id = data.id
  })

  /* Repoert close event @TODO implement ping - pong*/
  socket.on('close', (data) => {
    log.socket(data, 'closed')
  })

  return socket
}

export default createSocket
