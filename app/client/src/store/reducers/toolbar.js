import { applicationState } from '../state'

export default ($eventbus, widgetsLookup) => (state, action) => {
  let tool, widget
  if (state) {
    switch (action.type) {
      case 'init':
        return applicationState.toolbar
      case 'projectInit':
        return applicationState.toolbar
      case 'toolbar/add':
        tool = {}
        if (action.payload && action.payload.widget && action.payload.uuid) {
          widget = action.payload.widget
          if (!widget.uuid) {
            widget.uuid = action.payload.uuid
          }
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
        } else {
          // something went wrong so lets not do anything
          return state
        }
        return {
          ...state, ...tool
        }
      case 'toolbar/update':
        return mergeDeepRight(state, action.payload)
      default:
        return state
    }
  }
}
