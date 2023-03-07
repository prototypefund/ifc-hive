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
    this.socket = new WebSocket(host)
    this._registerSocketEvents()
  }

  /*
   *   
   */
  reconnect() {

    // return false if we are connected
    // if (this.socket.readyState === 1) return false

    // reset our healthcheck properties as we are apparantly off-line
    this.lastPingTimestamp = false
    this.lastPingTimestamp = false
    this.pingMap = {}

    this.socket = new WebSocket(this.host)
    this._registerSocketEvents()
    this.retryCount += 1
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

  /*
   * getReadyState 
   * @return {number} - returns the socket state
   * @TODO this is  not reliable we need to implement our own ping - pong check
   */
  getReadyState () {
    return this.socket.readyState
  }
  
  /*
   * Register socket events
   */
  _registerSocketEvents () {
    if (!this.socket) return false

    /* open event */
    this.socket.addEventListener('open', (event) => {
      this.emit('open', event.data)
      this.retryCount = 0
      this.heartbeat = true
      this._sendHeartbeat()
    })

    /* close event */
    this.socket.addEventListener('close', (event) => {
      this.emit('close', event.data)
      this.heartbeat = false
      if (this.heartbeatIntervallId) {
        clearInterval(this.heartbeatIntervallId)
      }
    })

    /* error event */
    this.socket.addEventListener('error', (event) => {
      this.emit('error', event.data)
    })

    /*
     * message event
     *
     * Messages from the server arrive in two formats
     * 1. "__ping__" expects a "__pong__" reponse (this._pong())
     * 2. any data object meaningful to the business logic come in the form:
     *
     *    {
     *      type: 'string',
     *      params:  { ... }
     *    }
     */
    this.socket.addEventListener('message', (event) => {


      // emit a message event anyway, just in case somebody is interested in the raw messages
      this.emit('message', event.data)

      // @TODO handle message event depending on the type
      // const data = JSON.parse(event.data)
      const data = JSON.parse(event.data)

      switch (data.type) {
        case 'pong':
          this.emit('pong', data.params)
          this._handlePong(data.params.token)
          break
        /* incoming data objects as handled by our application logic, e.g. user, memo, tag etc.  */
        case 'data':
          this.emit('data', data.params)
          break
        /* confirmation that our request to join a room was granted by the server */
        case 'join': 
          this.emit('join', data.params)
          break
        /* confirmation form the server that we left a socket room */
        case 'leave':
          this.emit('leave', data.params)
          break
        /* confirmation that we now have an authenticated socket connection  */
        case 'login':
          this.emit('login', data.params)
          break
        /* confirmation the server no longer considers us authenticated  */
        case 'logout':
          this.emit('logout', data.params)
          break
        /* the server tells us our unique socket id for the current connection  */
        case 'id':
          this.emit('id', data.params)
          break
        default:
          this.emit('error', { msg: 'Unknown event type from socket server' })
      }
    })
  }

  /*
   * Send pong
   *
   * The server expects us to promptly answer with a pong message whenever we
   * recieve a ping. Via this ping-pong routine both side monitor if the
   * connection is still intact. 
   */
  _pong (token) {
    const payload = { type: 'pong', params: { token } }
    return this.socket.send(JSON.stringify(payload))
  }

  /*
   * Ping
   *
   * Sends a ping to the server and initiates house keeping
   * of the previously send pings
   */
  _ping () {
    if (!this.heartbeat) return false

    // Have send a previous ping and are we still waiting for a pong?
    // if so emit a connection error
    if (this.lastPingTimestamp && this.lastPingToken) {
      if (this.pingMap !== {} && this.pingMap[this.lastPingToken]) {
        this.emit('timeout')
      }
    }

    // send a new ping
    this.lastPingToken = Date.now() // @TODO should unique id, e.g. nanoid()
    this.lastPingTimestamp = Date.now()
    const payload = JSON.stringify({ type: 'ping', params: { token: this.lastPingTimestamp } })
    this.socket.send(payload)
    // save ping in 
    this.pingMap[this.lastPingToken] = this.lastPingTimestamp

  }
  
  /*
   * Remove pint event from map, so we know a particual ping received its pong
   * @type {string} token
   */
  _handlePong (token) {
    if (this.pingMap[token]) {
      delete this.pingMap[token]
    }
  }

  /*
   * start the heartbeat 
   */
  _sendHeartbeat () {
    this.heartbeatIntervallId = setInterval( () => this._ping(), this.heartbeatIntervall)
  }
  
}

export default SocketClient
