import { mergeDeepRight } from 'ramda'
import { storePatterns } from '../../state.js'

/*
 * update widget
 */
function widgetsUpdate(state, action) {
  const configuredWidget = {}
  // merge given payload onto widget state
  configuredWidget[action.uuid] = mergeDeepRight(state[action.uuid], action.payload)
  return mergeDeepRight(state, configuredWidget)
}

/*
 * add widget
 */
function widgetsAdd(state, action) {
  const { $eventbus } = action.meta
  const newWidgets = {}
  if (action.payload.length > 0) {
    action.payload.forEach(widget => {
      if (widget.uuid && state[widget.uuid]) {
        // if we are in widgets/add but the widget uuid already exists, we do
        // nothing as updates shall be done in widgets/update
        return state
      }
      // if we have a version number associated with the widget we receive it
      // completely from the server, so no config file shizzle necessary
      if (!widget.version) {
        // get the config file for the current widget
        if (widget.type) {
          // @TODO pseudo effect
          $eventbus.emit('widgetTypeConfLoader', widget)
        } else {
          // @TODO pseudo effect
          $eventbus.emit('widgetConfLoader', widget)
        }
      }

      // add page specific config to widget instance state
      if (!newWidgets[widget.uuid]) {
        newWidgets[widget.uuid] = mergeDeepRight(storePatterns.widget, widget)
      }
    })
    return mergeDeepRight(state, newWidgets)
  }
  return state
}

export {
  widgetsUpdate,
  widgetsAdd,
}
