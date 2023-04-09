import { applicationState } from '../../state'
import { mergeDeepRight } from 'ramda'

/*
 * init
 */
function init (state, action) {
  return applicationState.navigationTools
}

/*
 * project init
 */
function projectInit (state, action) {
  return applicationState.navigationTools
}

/*
 * navigation tools add
 */
function navigationToolsAdd (state, action, $eventbus, widgetsLookup) {
  let tool = {}
  let widget
  // early return of unchagned state if we are missing something vital
  if (!action.payload || !action.payload.widget || !action.payload.uuid) return state

  widget = action.payload.widget
  if (!widget.uuid) { widget.uuid = action.payload.uuid }
  if (!widgetsLookup[widget.uuid]) {
    // make a generic widget state map
    $eventbus.emit('store/dispatch', {
      type: 'widgets/add',
      payload: [{
        ...widget
      }]
    })
  }
  tool[action.payload.uuid] = action.payload

  return { ...state, ...tool }
}

/*
 * navigation tools udpate
 */
function navigationToolsUpdate (state, action) {
  return mergeDeepRight(state, action.payload)
}

export {
  init,
  projectInit,
  navigationToolsAdd,
  navigationToolsUpdate,
}
