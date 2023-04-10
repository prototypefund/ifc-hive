/*
 * navigation tools reducers
 */
import { mergeDeepRight } from 'ramda'

/*
 * navigation tools add
 */
function navigationToolsAdd (state, action) {
  const { $eventbus, widgetsLookup } = action.meta
  let tool = {}
  let widget
  // early return of unchagned state if we are missing something vital
  if (!action.payload || !action.payload.widget || !action.payload.uuid) return state

  widget = action.payload.widget
  if (!widget.uuid) { widget.uuid = action.payload.uuid }
  if (!widgetsLookup[widget.uuid]) {
    // make a generic widget state map
    $eventbus.emit('storeDispatch', {
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
  navigationToolsAdd,
  navigationToolsUpdate,
}
