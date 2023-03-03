import { applicationState } from '../state'

export default ($eventbus) => (state, action) => {
  if (state) {
    let items
    switch (action.type) {
      case 'init':
        return applicationState.notifications
      case 'notifications/add':
        items = JSON.parse(JSON.stringify(state.items))
        action.payload.time = Date.now()
        action.payload.state = 'unread'

        items.unshift(action.payload)
        return {
          ...state, items, unreadCount: state.unreadCount + 1
        }
      case 'notifications/clear':
        return applicationState.notifications

      case 'notifications/markAllAsSeen':
        items = JSON.parse(JSON.stringify(state.items))
        items.forEach(item => {
          if (item.state !== 'read') {
            item.state = 'seen'
          }
        })
        $eventbus.emit('store/dispatch', {
          type: 'notifications/update',
          payload: {
            unreadCount: 0
          }
        })
        return {
          ...state, items
        }
      case 'notifications/markAllAsRead':
        items = JSON.parse(JSON.stringify(state.items))
        items.forEach(item => {
          if (item.state === 'unread') {
            item.state = 'read'
          }
        })
        $eventbus.emit('store/dispatch', {
          type: 'notifications/update',
          payload: {
            unreadCount: 0
          }
        })
        return {
          ...state, items
        }
      case 'notifications/markAsRead':
        items = JSON.parse(JSON.stringify(state.items))
        if (items[action.payload.index].state !== 'read') {
          items[action.payload.index].state = 'read'
          if (state.unreadCount > 0) {
            $eventbus.emit('store/dispatch', {
              type: 'notifications/update',
              payload: {
                unreadCount: state.unreadCount - 1
              }
            })
          }

        }

        return {
          ...state, items: items
        }
      case 'notifications/markUnread':
        items = JSON.parse(JSON.stringify(state.items))
        if (items[action.payload.index].state !== 'unread') {
          items[action.payload.index].state = 'unread'
          $eventbus.emit('store/dispatch', {
            type: 'notifications/update',
            payload: {
              unreadCount: state.unreadCount + 1
            }
          })
        }
        return {
          ...state, items: items
        }
      case 'notifications/toggle':
        if (action.payload.toggled === false && state.toggled === true) {
          $eventbus.emit('store/dispatch', {
            type: 'notifications/update',
            payload: {
              unreadCount: 0
            }
          })
          $eventbus.emit('store/dispatch', {
            type: 'notifications/markAllAsSeen',
          })
        }
        return {
          ...state, ...action.payload
        }
      case 'notifications/update':
        return mergeDeepRight(state, action.payload)
      default:
        return state
    }
  }
}
