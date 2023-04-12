/*
 * EventEmiter
 * @class
 *
 * This class mimicks the nodejs EventEmitter. It is primarily used as the
 * global eventbus so different parts of the application can communicate with
 * each other without being tightly coupled.
 * e.g. store -> http client, component -> http client, component -> socket etc.
 */

class EventEmitter {
  constructor (eventMap) {
    /*
     * @type {object} events - container to hold key valye pairs of events/functions
     */
    this.events = {}
    this.eventMap = eventMap
  }

  /*
   * on
   *
   * @param {string} event - event name
   * @param {function} listener - callback function
   */
  on (event, listener) {
    if (!this.isValid(event)) return false
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
    if (!this.isValid(event)) return false
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
    if (!this.isValid(event)) return false
    const remove = this.on(event, (...args) => {
      remove()
      listener.apply(this, args)
    })
  }

  isValid (event) {
    // early return if we don't have an eventMap
    if (!this.eventMap) return true
    // throw error if the event is unknown
    if (!this.eventMap[event]) {
      throw new Error(`Unkown event ${event}`)
    }
    // return true if the event exists in the eventMap
    return true
  }
}

export default EventEmitter
