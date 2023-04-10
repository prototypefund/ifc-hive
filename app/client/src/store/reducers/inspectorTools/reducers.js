/*
 * inspector reducers
 */
import { mergeDeepRight } from 'ramda'

/*
 * inspector tool add
 */
function inspectorToolsAdd (state, action) {
  const { widgetsLookup, $eventbus } = action.meta
  let tool = {}
  // early return if something vital is missing
  if (!action.payload || !action.payload.widget || !action.payload.uuid) return state

  let widget = action.payload.widget
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
 * inspector tool update
 */
function inspectorToolsUpdate (state, action) {
  return mergeDeepRight(state, action.payload)
}

export {
  inspectorToolsAdd,
  inspectorToolsUpdate
}
