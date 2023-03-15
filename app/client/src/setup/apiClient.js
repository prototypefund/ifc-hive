import log from '@lib/logger.js'
import { v4 as uuidv4 } from 'uuid'

export function registerApiHandlerEvents ($api, $store, $eventbus) {

$eventbus.on('data_update', (item) => {

  // x-request-id: uuidv4()
  $api.put(`/lab/memo/${item._source._id}`, item )
})
}

