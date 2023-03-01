/*
 * this file holds functions to manage the http client
 */
import axios from 'axios'

/* Create the http client */
export const httpClient = axios.create({
  // set default headers
  headers: {
    'Accept-Version': '*'
  },
  // validate status
  validateStatus (status) {
    return status >= 200 && status < 300 // default
  }
})

/*
 * Config function
 * @param {object} client - the axios instance
 * @param {object} config - config object
 *
 * const config = {
 *  baseURL: YOUR_BASE_URL
 * }
 */
export function configClient (client, config) {
  // set base uslr
  client.defaults.baseURL = config.baseURL
}


/*
 * Set JWT token in http client so we don't have to care about it
 * @param {object} client - axios instance
 * @param {string} token - the JWT token
 */
export function setHttpToken (client, token) {
  client.defaults.headers.common.Authorization = `Bearer ${token}`
  client.default.headers.Authorization = `Bearer ${token}`
}

/*
 * Unset a previously set token 
 * @param {bject} client - axios instance
 */
export function unsetHttpToken (client) {
  client.defaults.headers.common.Authorization = null
  client.default.headers.Authorization = null
}

export default httpClient
