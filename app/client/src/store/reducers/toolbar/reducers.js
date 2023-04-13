
/*
 * toolbar add
 */
function toolbarAdd(state, action) {
  const { $eventbus, widgetsLookup } = action.meta
  // early return of given state if something vital is missing
  if (!action.payload || !action.payload.widget || !action.payload.uuid) return state

  const tool = {}
  const widget = action.payload.widget
  if (!widget.uuid) {
    widget.uuid = action.payload.uuid
  }
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
  return {
    ...state, ...tool
  }
}

export {
  toolbarAdd,
}
