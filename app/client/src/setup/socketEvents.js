/*
 * listen to socket events sent from the server
 *
 * @param {object} $socket - a socketClient instance 
 * @param {object} $store - a minirx-store instance, so we can dispatch actions
 * @param {object} $eventbus - instance of our custom eventbus
 */
import log from '@lib/logger.js'

export function registerSocketEvents($socket, $store, $eventbus) {

  /* required for reconnection */
  let intervalId = false
  // local container to collect incoming batch items before we push them to the store
  let batchItems = []
  // are we batch loading right now?
  let batchLoading = false

  /*
   * connect
   * fired every time we have a new connection established
   */
  $socket.on('connect', (data) => {

    log.socket('connect', 'Socket connection established')
    $store.dispatch({ type: 'socket/status', payload: { status: 1, message: 'Connected' } })
    // if we previously tried to connect stop that interval
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = false
    }
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
    // push received projects into data store
    $store.dispatch({ type: 'data/push', payload: { data: data.projects } })
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
    $store.dispatch({ type: 'project/addlookup', payload: projectLookup })
  })

  /* successfull join requests are confirmed by the server */
  $socket.on('joinConfirmation', (data) => {
    $store.dispatch({
      type: 'ui/update',
      payload: { loading: true, projectSwitching: true }
    })
    // Reset all store states which are project dependend. 
    if (data.project && data.project.config) {
      $store.dispatch({ type: 'projectInit' })
      // TODO add mobile switch
      if (data.project.config.browser) {
        if (data.project.config.browser.ui) {
          $store.dispatch({
            type: 'ui/update',
            payload: data.project.config.browser.ui
          })
        }
        if (data.project.config.browser.pages && Object.keys(data.project.config.browser.pages).length > 0) {
          for (const [key, value] of Object.entries(data.project.config.browser.pages)) {
            $store.dispatch({
              type: "pages/add",
              payload: value,
            });
          }
        }
        if (data.project.config.browser.tools && data.project.config.browser.tools.length > 0) {
          data.project.config.browser.tools.forEach(tool => {
            $store.dispatch({
              type: "toolbar/add",
              payload: tool,
            });
          })

        }
      }
    }


    log.socket('joinConfirmation received', data)
    // TODO possibly redirect to / route instead of just adding loading
    $store.dispatch({
      type: 'ui/update',
      payload: { loading: false, projectSwitching: false }
    })
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
   * const data = { expect: 13 }
   */
  $socket.on('batchDataStart', (data) => {
    batchLoading = true
    batchItems = []
    log.socket('start batch data', data)
  })

  /*
   * batchDataStop   
   * The server is done with the batch and reports to count of the actually transmitted
   * objects.
   */
  $socket.on('batchDataStop', () => {
    batchLoading = false
    log.socket('stop batch data', { received: batchItems.length })
    $store.dispatch({ type: 'data/push', payload: { data: batchItems } })
  })

  /*
   * data
   * We received a data object from the server
   */
  $socket.on('data', (data) => {
    log.socket('data', data)
    // NOTE: always pass array into data/push payload
    $store.dispatch({ type: 'data/push', payload: { data: [data] } })
  })

  /*
   * dataTest
   * Debugging data transfer
   * @TODO remove
   */
  $socket.on('dataTest', (data) => {
    if (batchLoading === true) {
      batchItems.push(data)
    } else {
      log.socket('dataTest', data)
      // $store.dispatch({ type: 'data/push', payload: { data } })
    }

  })
}
