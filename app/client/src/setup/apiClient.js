import log from '@lib/logger.js'

export function registerApiHandlerEvents ($api, $store, $eventbus) {

$eventbus.on('data_update', (item) => {
  $api.put(`/lab/memo/${item._source._id}`, item)
  log.store(item, 'storeItemUpdate new thing')
})
}

