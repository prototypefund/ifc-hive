/*
 * This file adds global functions to be used in templates.
 * E.g. function to format currency or dates.
 */
import { format, intlFormat } from 'date-fns'

const filters = {
  /*
   * Format date with date-fns
   */
  dateFormat (value, pattern) {
    return intlFormat(new Date(value), {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',

    }, { locale: 'de-DE' })
    // return '123'
  }
}

export {
  filters,
}

export default filters
