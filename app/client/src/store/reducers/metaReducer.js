import { v4 as uuidv4 } from 'uuid'

export default ($eventbus) => [(reducer) => {
  return (state, action) => {
    let page, widgets, pageUUID

    // meta "effect like" reducer for widget add before page add
    if (action.type == "pages/add") {
      page = action.payload
      pageUUID = action.payload.uuid || action.routeName.replace('.', '-')
      // if we have a widget config for this page we need to setup the widget states
      if ((page.slots || page.widgets) && !state.pages[pageUUID]) {
        widgets = []
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
        $eventbus.emit('store/dispatch', { type: 'widgets/add', payload: widgets })
        if (widgets.length > 0) {
          $eventbus.emit('store/dispatch', {
            type: 'widgets/add',
            payload: widgets
          })
        }
        if (page.tools) {
          page.tools.forEach(tool => {
            $eventbus.emit('store/dispatch', {
              type: 'toolbar/add',
              payload: tool
            })
          })
        }
        if (page.navigationTools) {
          page.navigationTools.forEach(tool => {
            $eventbus.emit('store/dispatch', {
              type: 'navigationTools/add',
              payload: tool
            })
          })
        }
        if (page.inspectorTools) {
          page.inspectorTools.forEach(tool => {
            $eventbus.emit('store/dispatch', {
              type: 'inspectorTools/add',
              payload: tool
            })
          })
        }
      }
    }
    return reducer(state, action)
  }
}]
