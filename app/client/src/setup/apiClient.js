/*
 * Send http requests to the server
 *
 * Listen to the eventbus and execute http requests depending on the events
 */
import log from '@lib/logger.js'
import { v4 as uuidv4 } from 'uuid'
import localProjectConfig from './_config.temp.js'

function registerApiHandlerEvents($api, $store, $eventbus) {

  /* data_update */
  $eventbus.on('data_update', (item) => {
    // x-request-id: uuidv4()
    $api.put(`/journal/ticket/${item._source._id}`, item._source)
  })

  /* saveLocalProjectConfig */
  $eventbus.on('saveLocalProjectConfig', async () => {
    log.api('Save local project config', localProjectConfig)
    $api.put('/core/project/_all/config', localProjectConfig)
  })
}

export {
  registerApiHandlerEvents
}
