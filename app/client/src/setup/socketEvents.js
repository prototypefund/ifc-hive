/*
 * listen to socket events received from the server
 *
 * @param {object} $socket - a socketClient instance 
 * @param {object} $store - a minirx-store instance, so we can dispatch actions
 * @param {object} $eventbus - instance of our custom eventbus
 */
import log from '@lib/logger.js'
import { setProjectBrowserConfig } from '@lib/setProjectConfiguration.js'

function registerSocketEvents($socket, $store, $eventbus) {
  const storeBatchSize = 600
  /* required for reconnection */
  let intervalId = false
  // local container to collect incoming batch items before we push them to the store
  let batchItems = []
  let batchItemsCount = 0
  // are we batch loading right now?
  let batchLoading = false

  /*
   * connect
   * fired every time we have a new connection established
   */
  $socket.on('connect', (data) => {
    log.socket('connect', 'Socket connection established')
    $store.dispatch({ type: 'socket/status', payload: { status: 1, message: 'Connected' } })
    // @TODO if we re-connect after a drop out we need to subscribe to our project without
    // completely setting up the project up, e.g. only re-join project room.
  })

  /*
   * disconnect
   */
  $socket.on('disconnect', () => {
    $store.dispatch({ type: 'socket/status', payload: { status: 0, message: 'disconnect' } })
  })

  /*
   * reconnect
   */
  $socket.on('reconnect', () => {
    $store.dispatch({ type: 'socket/status', payload: { status: 2, message: 'Reconnect' } })
    const projectId = $store.select(state => state.project.id)
  })

  /*
   * hello
   * const data = { id: 'you'session'id' }
   */
  $socket.on('hello', (data) => {
    log.socket('hello', data)
  })

  /*
   * close
   */
  $socket.on('close', () => {
    log.socket('close', 'socket connection lost')
  })

  /*
   * project/list
   * Reports or updates the list of available projects
   */
  $socket.on('projects/list', (data) => {
    // early return if there are no data for us
    if (!data.projects || data.projects.length < 1) return
    log.socket('project/list', data)
    // handle projects for usage and save to store
    const projectList = []
    // TODO remove lookup once the slots in v-select work properly for direct
    // referencation of data items from data store
    const projectLookup = {}
    data.projects.forEach(project => {
      projectList.push(project._id)
      projectLookup[project._id] = project
      delete projectLookup[project._id].config
    })
    // add project
    $store.dispatch({ type: 'project/addlist', payload: projectList })
    // TODO REMOVE LOOKUP
    $store.dispatch({ type: 'project/addlookup', payload: projectLookup })
  })

  /*
   * on joinConfirmation 
   */
  $socket.on('joinConfirmation', (data) => {
    $store.dispatch({
      type: 'ui/update',
      payload: { loading: true }
    })
    // @TODO introduce switch  or map to distinguish browser and mobile
    setProjectBrowserConfig(data.project, $store)
    log.socket('joinConfirmation received', data)
  })

  /* 
   * leaveConfirm
   * the server reports when we leave a room, be it in resonse a our own
   * request or forcefully. 
   */
  $socket.on('leaveConfirmation', (data) => {
    //TODO maybe add the projectInit call here
    log.socket('leaveConfirmation received', data)
  })

  /* login event
   * the server has approved our token
   */
  $socket.on('login', (data) => {
    log.socket('login successful', 'Socket connection successfully authenticated')
  })

  /*
   * batchDataStart
   * The server is just about to start sending a large batch of data
   * const data = { expect: Number, ticketCount: Number, userCount: Number, tagCount: Number }
   */
  $socket.on('batchDataStart', (data) => {
    batchLoading = true
    batchItems = []
    $eventbus.emit('batchDataStart', data)
    log.socket('start batch data', data)
  })

  /*
   * batchDataStop   
   * The server is done with the batch and reports to count of the actually transmitted
   * objects.
   */
  $socket.on('batchDataStop', () => {
    batchLoading = false
    log.socket('stop batch data', { received: batchItemsCount })
    $eventbus.emit('batchDataStop', batchItemsCount)
    $store.dispatch({ type: 'data/push', payload: { data: batchItems, initialData: true } })
    $store.dispatch({
      type: 'notifications/add',
      payload: {
        event: 'push',
        message: `we've received ${batchItemsCount} new Items for you!`
      }
    })
  })

  /*
   * data
   * We received a data object from the server
   */
  $socket.on('data', (data) => {
    if (batchLoading === true) {
      batchItemsCount = batchItemsCount + 1
      batchItems.push(data)
      if (batchItems.length >= storeBatchSize) {
        $store.dispatch({ type: 'data/push', payload: { data: batchItems, initialData: true } })
        batchItems = []
      }
      $eventbus.emit('batchDataItemPush', batchItemsCount)
    } else {
      log.socket('data', data)
      $store.dispatch({ type: 'data/push', payload: { data: [data] } })
    }
  })
}

export default registerSocketEvents
export {
  registerSocketEvents,
}
