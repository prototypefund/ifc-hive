import { v4 as uuidv4 } from 'uuid'

export default ($eventbus) => [(reducer) => {
  return (state, action) => {
    let page, widgets

    // meta "effect like" reducer for widget add before page add
    if (action.type == "pages/add") {
      page = action.payload
      // if we have a widget config for this page we need to setup the widget states
      if (page.slots || page.widget) {
        widgets = []
        const makeWidget = (widget) => {
          if (!widget.uuid) {
            widget.uuid = uuidv4()
          }

          if (!state.widgets[widget.uuid]) {
            // make a generic widget state map
            widgets.push({
              uuid: widget.uuid,
              name: widget.name,
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
          makeWidget(page.widget)
        }

        // add page specific widget configs to state
        $eventbus.emit('store/dispatch', { type: 'widgets/add', payload: widgets })
        if (widgets.length > 0) {
          $eventbus.emit('store/dispatch', {
            type: 'widgets/add',
            payload: widgets
          })
        }
        if (page.tool) {
          $eventbus.emit('store/dispatch', {
            type: 'toolbar/add',
            payload: page.tool
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
      }
    }
    return reducer(state, action)
  }
}]
