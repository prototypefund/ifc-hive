/*
 * SocketClient
 *
 * @class
 * @constructor
 *
 * Events
 *  - open - native Websocket event open
 *  - close - native Websocket event close
 *  - error - native Websocket event error
 *  - message  - native Websocket event error
 *  - data - actual objects arriving
 *  - join - confirmation after successful entry to a room
 *  - leave - confirmation after leaving a room
 *  - login - confirmation after submitting a token for the first time. 
 *  - logout - notification when the server terminated the socket connection
 *  - id - server gives us a session id
 *  - timeout - server didn't send pong in required response time
 *
 *  internal message format between client and server
 *  {
 *    type: 'string',
 *    token: 'string',
 *    params:  { ... }
 *  }
 *
 *  @TODO send unique data, e.g. generated with nanoid, along the control frames. 
 *  When answering a ping with a pong the party answering needs to send back the exakt
 *  same data along. 
 */
import io from 'socket.io-client'

const readyState = {
  'CONNECTING': 0,
  'OPEN': 1,
  'CLOSING': 2,
  'CLOSED': 3,
}

class SocketClient {
  
  /*
   * @constructor
   */
  constructor() {

    /*
     * @type {object}
     */
    this.socket = false
    /*
     * @type {string}
     */
    this.id = false
    /*
     * Socket Server Host
     * @type {string}
     */
    this.host = null
    /*
     * Also on the socket we need to authenticate ourselves to the server
     * @type {string}
     */
    this.token = false
    /*
     * Container to hold event and their respective subscribers
     * @type {object}
     */
    this.events = {}

    /*
     * Keep track of the rooms we are currently in
     * It will be mostly ;
     *  - a single project
     *  - the user account
     * @type {array}
     */
    this.rooms = []

    /*
     * are we in hearbeat modus? Sending pings in intervals?
     * @type { boolean }
     */
    this.heartbeat = false

    /*
     * To keep the server clean, we need to send a signal in a fixed
     * interval otherweise the server will discard our connection
     * @type {number}
     */
    this.heartbeatIntervall = 2000

    /*
     * Heartbeat intervall id, so we can address and stop the timer
     * @type {number}
     */
    this.heartbeatIntervallId = false

    /*
     * when did we send the last ping?
     * @type {number} unix timestamp
     */
    this.lastPingTimestamp =  false

    /*
     * With every ping we send a unique token. We expect the server to send
     * this token along with its pong. That way we know to which ping the
     * server is answering. 
     * @type {string}
     */
    this.lastPingToken = false

    /*
     * Keep track of all pings we have send and remove a ping
     * when we get the corresponding pong. 
     * {
     * pingToken: pingTime
     * }
     */
    this.pingMap = {}


    this.retryCount = 0
    this.maxRetries = 10
    this.retryInveralId = false
  }

  /*
   * connect
   *
   * @param {string}
   * @param {token}
   */
  connect (host, token) {
    this.host = host
    this.token = token
    this.socket = io(host)
  }

  /*
   * Broadcast a message to a room
   * @param {object} data - a message in the format specified in the header of this file
   * @param {string} room - the uuid of the object of interest (project, memo etc.)
   */
  broadcast (msg, room) {}

  /*
   * Join a socket room
   * @param {string} id - the room id, usually the project uuidal
   */
  join (uuid) {}

  /*
   * leave a socket room
   * @param {string} - the room id
   */
  leave (uuid) {}

  /*
   * on
   *
   * @param {string} event - event name
   * @param {function} listener - callback function
   */
  on (event, listener) {
      if (typeof this.events[event] !== 'object') {
          this.events[event] = []
      }
      this.events[event].push(listener)
      return () => this.removeListener(event, listener)
  }

  /*
   * removeListener
   *
   * @param {string} event - event name
   * @param {function} listener - callback function
   */
  removeListener (event, listener) {
    if (typeof this.events[event] === 'object') {
        const idx = this.events[event].indexOf(listener)
        if (idx > -1) {
          this.events[event].splice(idx, 1)
        }
    }
  }

  /*
   * emit
   *
   * @param {string} event - event name
   * @param {string|object|boolean} - arbitrary arguements
   */
  emit (event, ...args) {
    if (typeof this.events[event] === 'object') {
      this.events[event].forEach(listener => listener.apply(this, args));
    }
  }

  /*
   * once
   *
   * @param {string} event - event name
   * @param {string|object|boolean} - arbitrary arguements
   */
  once (event, listener) {
    const remove = this.on(event, (...args) => {
        remove()
        listener.apply(this, args)
    })
  }
}

export default SocketClient
