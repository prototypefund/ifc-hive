import { mergeDeepRight} from 'ramda'
import { applicationState, storePatterns } from '../state'

export default ($eventbus) => (state, action) => {
  if (state) {
    let newWidgets, configuredWidget

    switch (action.type) {

      /* init */
      case 'init':
        return applicationState.widgets

      /* widget/update */
      case 'widgets/update':
        configuredWidget = {}
        // merge given payload onto widget state
        configuredWidget[action.uuid] = mergeDeepRight(state[action.uuid], action.payload)
        return mergeDeepRight(state, configuredWidget)

      /* widgets/add */
      case 'widgets/add':
        newWidgets = {}
        if (action.payload.length > 0) {
          action.payload.forEach(widget => {
            // get the config file for the current widget
            if (widget.type) {
              // @TODO pseudo effect
              $eventbus.emit('widgetTypeConfLoader', widget)
            } else {
              // @TODO pseudo effect
              $eventbus.emit('widgetConfLoader', widget)
            }
            // add page specific config to widget instance state
            if (!newWidgets[widget.uuid]) {
              newWidgets[widget.uuid] = mergeDeepRight(storePatterns.widget, widget)
            }
          })
          return mergeDeepRight(state, newWidgets)
        }
        return state

      /* widgets/remove */
      case 'widgets/remove':
        newWidgets = {}
        if (action.payload.length > 0) {
          const newWidgets = JSON.parse(JSON.stringify(state))
          action.payload.forEach(widgetUUID => {
            if (!newWidgets[widgetUUID])
              console.error("apparently we try to delete a widget we don't have in the state")
            delete newWidgets[widgetUUID]
          })
          return newWidgets
        }
        return state

      /* default return unchanged state */
      default:
        return state
    }
  }
}
