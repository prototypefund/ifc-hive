import { applicationState } from '../../state'
import { mergeDeepRight } from 'ramda'

/*
 * init
 */
function init (state, action) {
  return applicationState.notifications
}

/*
 * project init
 */
function projectInit (state, action) {
  return applicationState.notifications
}

/*
 * add notifcation
 */
function notificationsAdd (state, action) {
  let items
  items = JSON.parse(JSON.stringify(state.items))
  action.payload.time = Date.now()
  action.payload.state = 'unread'

  items.unshift(action.payload)
  return {
    ...state, items, unreadCount: state.unreadCount + 1
  }
}

/*
 * clear notifications
 */
function notifacationsClear (state, action) {
  return applicationState.notifications
}

/*
 * mark all notifcations as seen
 */
function notificationsMarkAllAsSeen (state, action, $eventbus) {
  let items
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
}

/*
 * mark all notifactions as read
 */
function notificationsMarkAllAsRead (state, action, $eventbus) {
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
}

/*
 * mark notification as read
 */
function notificationsMarkAsRead (state, action, $eventbus) {
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
}

/*
 * mark notifcation as unread
 */
function notificationsMarkUnread (state, action, $eventbus) {
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
}

/*
 * toggle notifications
 */
function notificationsToggle (state, action, $eventbus) {
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
}

/*
 * update notifications
 */
function notificationsUpdate (state, action) {
  return mergeDeepRight(state, action.payload)
}

export {
  init,
  projectInit,
  notificationsAdd,
  notifacationsClear,
  notificationsMarkAllAsSeen,
  notificationsMarkAllAsRead,
  notificationsMarkAsRead,
  notificationsMarkUnread,
  notificationsToggle,
  notificationsUpdate 
}
