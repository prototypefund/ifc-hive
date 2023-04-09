import { applicationState } from '../../state'
import { mergeDeepRight } from 'ramda'

/*
 * init
 */
function init (state, action, $eventbus) {
  return applicationState.toolbar
}

/*
 * projectInit
 */
function projectInit (state, action, $eventbus) {
  return applicationState.inspectorTools
}

/*
 * inspector tool add
 */
function inspectorToolsAdd (state, action, $eventbus, widgetsLookup) {
  let tool = {}
  // early return if something vital is missing
  if (!action.payload || !action.payload.widget || !action.payload.uuid) return state

  let widget = action.payload.widget
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
 * inspector tool update
 */
function inspectorToolsUpdate (state, action, $eventbus) {
  return mergeDeepRight(state, action.payload)
}

export {
  init,
  projectInit, 
  inspectorToolsAdd,
  inspectorToolsUpdate
}
