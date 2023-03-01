/*
 *  Custom logger function 
 *
 *  We use this mainly to format the output in the dev console, e.g. 
 *  in order to color code log messages and events coming from 
 *  different components, such
 *    - reduz store
 *    - websocket client
 *    - http API client
 *
 * exemple:
 *
 * 1. use generic log function
 *
 *    log.log('my message', 'store', 'my title', )
 *
 * 2. Or use short cuts for types with message/data and title as paramaters
 *
 *    log.api(data, 'GET memo')
 *    log.store(data, 'My custom log event')
 *    log.socket({ msg: 'some message', data: {} }, 'subject or title')
 *    log.info('Simple message')
 *
 * NOTE: Beware that when using the error class the console will point you to the
 * respective line in thie file and not to the the line in your file which called the function. 
 * So especially with errors it is best to use the default `console.error` function.
 */

/*
 * Constant Log Types 
 * We specify types and formats for each type. The format are CSS rules separated with semicolon
 */
const TYPE = {
  info: '',
  store: 'color: #00d3ba',
  api: 'color: #c666ff',
  socket: 'color: #eee600',
  error: 'color: #fc4b4b',
  warning: 'color: #CC8800',
}

/*
 * Logger Class
 *
 * @class 
 */
class Logger {

  /*
   * Constructor
   */
  constructor ()  {
    this.level = 1 // 0: no logging: 0 development 1, verbose 2
  }

  /*
   * Log 
   *
   * @param {string|object|array} message - when given a type whever comes in the second line
   * @param {string} type - one of the attribues of the TYPE object above
   * @param {string} title - 
   * @param {number} level = log level 0 - 2 
   */
  log (message, type, title, level = 1) {
    // return if the message level is higher than the current log level
    if (level > this.level) return false
    // specify the format
    const format = type && TYPE[type] in TYPE ? TYPE[type] : TYPE.default

    // print simple log if we only got a message
    if (arguments.length == 1)
      return console.log(message)

    if (type === 'error')
      return console.error(`%c${type}/${title}`, TYPE[type], '\n', message)

    // print a nicely formated message if we got at least a type
    console.log(`%c${type}/${title}`, TYPE[type], '\n', message)
  }

  /*
   * for convenience we provide some shortcuts to user, in the form of 
   *    type(data, title)
   *
   * example:
   *    socket(data, 'My log title')
   */

  /* socket */
  socket (message, title, level) {
    this.log(message, 'socket', title, level)
  }

  /* store */
  store (message, title, level) {
    this.log(message, 'store', title, level)
  }

  /* api */
  api (message, title, level) {
    this.log(message, 'api', title, level)
  }

  /* error - better use default console.error */
  error (message, title, level) {
    this.log(message, 'error', title, 0)
  }

  /* warning */
  warning (message, title, level) {
    this.log(message, 'warning', title, level)
  }

  /* info  */
  info (message, title, level) {
    this.log(message, 'default', title, level )
  }

}

export default Logger
