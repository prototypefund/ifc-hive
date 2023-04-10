/*
 * Create socket connection
 */
import io from 'socket.io-client'

/*
 * createSocket returns an instance of a custom SocketClient
 *
 * @param {string} host - our socket endpoint
 * @return {object} opts - socket.io options
 */
function createSocket(host, opts) {
  const defaults = {
    // path: '/socket/',
  }
  return io(host, { ...defaults, ...opts })
}

export default createSocket
export { createSocket }
