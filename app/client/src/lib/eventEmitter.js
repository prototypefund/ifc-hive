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
  constructor () {
    /*
     * @type {object} events - container to hold key valye pairs of events/functions
     */
    this.events = {}
  }

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

export default EventEmitter
