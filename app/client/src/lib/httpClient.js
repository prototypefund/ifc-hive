/*
 * this file holds functions to manage the http client
 */
import axios from 'axios'
import log from '../lib/logger.js'

/* Create the http client */
const httpClient = axios.create({
  // set default headers
  headers: {
    'Accept-Version': '*'
  },
  // validate status
  validateStatus(status) {
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
function configClient(client, config) {
  // set base uslr
  client.defaults.baseURL = config.baseURL
  client.defaults.headers.common['Accept-Version'] = '*'
  client.defaults.headers.common.Authorization = null
  client.defaults.headers.Authorization = null
}

/*
 * @param {object} client - axios instance
 */
async function apiHealthcheck(client) {
  try {
    const healthcheckResponse = await httpClient.get('/health')
    log.api('healthcheck', healthcheckResponse,)
  } catch (err) {
    console.error(`Can\'t connect to API ${API_BASE_URL}`)
    console.error(err)
  }
}


/*
 * Set JWT token in http client so we don't have to care about it
 * @param {object} client - axios instance
 * @param {string} token - the JWT token
 */
function setHttpToken(client, token) {
  log.api('setHttpToken', token,)
  client.defaults.headers.common.Authorization = `Bearer ${token}`
  client.defaults.headers.Authorization = `Bearer ${token}`
}

/*
 * Unset a previously set token 
 * @param {bject} client - axios instance
 */
function unsetHttpToken(client) {
  log.api('unsetHttpToken', token,)
  client.defaults.headers.common.Authorization = null
  client.defaults.headers.Authorization = null
}

export default httpClient
export {
  httpClient,
  configClient,
  apiHealthcheck,
  setHttpToken,
  unsetHttpToken,
}
