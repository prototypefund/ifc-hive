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
 *
 *  internal message format between client and server
 *  {
 *    type: 'string',
 *    token: 'string',
 *    params:  { ... }
 *  }
 */
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
     * To keep the server clean, we need to send a signal in a fixed
     * interval otherweise the server will discard our connection
     * @type {number}
     */
    this.heartbeatIntervall = 10
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
   * send raw message
   * @param {string|object}
   */
  send (msg) {
    this.socket.send(msg)
  }

  /*
   * Broadcast
   *
   */
  broadcast () {}

  /*
   * Join room
   * @param {string} id - the room id, usually the project uuidal
   */
  join (uuid) {}

  /*
   * leave room
   */
  leave () {}

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
   * Register socket events
   */
  _registerSocketEvents () {
    if (!this.socket) return false

    this.socket.addEventListener('open', (event) => {
      this.socket.send('hello from client')
      this.emit('open', event.data)
    })

    this.socket.addEventListener('close', (event) => {
      this.emit('close', event.data)
    })

    this.socket.addEventListener('error', (event) => {
      this.emit('error', event.data)
      console.error('Socket Error', event.data)
    })

    this.socket.addEventListener('message', (event) => {
      this.emit('message', event.data)
      // @TODO handle message event depending on the type
      const data = JSON.parse(event.data)

      switch (data.type) {
        case 'data':
          this.emit('data', data.params)
          break
        case 'join': 
          this.emit('join', data.params)
          break
        case 'leave':
          this.emit('leave', data.params)
          break
        case 'login':
          this.emit('login', data.params)
          break
        case 'logout':
          this.emit('logout', data.params)
          break
        case 'id':
          this.emit('id', data.params)
          break
        default:
          this.emit('error', { msg: 'Unknown event type from socket server' })
      }
      
      
    })
  }
}
