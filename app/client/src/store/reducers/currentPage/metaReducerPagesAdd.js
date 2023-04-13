const metaReducerPagesAdd = ($eventbus) => (reducer) => {
  return (state, action) => {
    const nextState = reducer(state, action)

    if (action.type == "pages/add") {
      const page = action.payload
      const pageUUID = action.payload.uuid || action.routeName.replaceAll('.', '-')
      // if we have a widget config for this page we need to setup the widget states
      if ((page.slots || page.widgets) && !state.pages[pageUUID]) {
        const widgets = []
        const makeWidget = (widget) => {
          if (!widget.uuid) {
            widget.uuid = uuidv4()
          }

          if (!state.widgets[widget.uuid]) {
            // make a generic widget state map
            // TODO remove either the ...props or props
            widgets.push({
              uuid: widget.uuid,
              name: widget.name,
              props: widget.props,
              ...widget.props
            })
          }
        }
        if (page.slots) {
          page.slots.forEach(slot => {
            const widget = slot.widget
            if (widget) {
              makeWidget(widget)
            }
          })
        } else {
          page.widgets.forEach(widget => {
            if (widget) {
              makeWidget(widget)
            }
          })
        }

        // add page specific widget configs to state
        $eventbus.emit('storeDispatch', { type: 'widgets/add', payload: widgets })
        if (widgets.length > 0) {
          $eventbus.emit('storeDispatch', {
            type: 'widgets/add',
            payload: widgets
          })
        }
        if (page.tools) {
          page.tools.forEach(tool => {
            $eventbus.emit('storeDispatch', {
              type: 'toolbar/add',
              payload: tool
            })
          })
        }
        if (page.navigationTools) {
          page.navigationTools.forEach(tool => {
            $eventbus.emit('storeDispatch', {
              type: 'navigationTools/add',
              payload: tool
            })
          })
        }
        if (page.inspectorTools) {
          page.inspectorTools.forEach(tool => {
            $eventbus.emit('storeDispatch', {
              type: 'inspectorTools/add',
              payload: tool
            })
          })
        }
      }
    }

    return nextState
  }
}

export {
  metaReducerPagesAdd,
}
