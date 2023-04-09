import * as reducers from './reducers.js'

/*
 * dataReducer
 */
export default ($eventbus) => (state, action) => {
  // early return if no state at all
  if (!state) return

  // map instead of switch statement
  const reducer = {
    'init': reducers.init,
    'projectInit': reducers.projectInit,
    'notifications/add': reducers.inspectorToolsAdd,
    'notifications/clear': reducers.notificationsClear,
    'notifications/markAllAsSeen': reducers.notificationsMarkAllAsSeen,
    'notifications/markAllAsRead': reducers.notificationsMarkAllAsRead,
    'notifications/markAsRead': reducers.notificationsMarkAsRead,
    'notifications/markUnread': reducers.notificationsMarkUnread,
    'notifications/toggle': reducers.notificationsToggle,
    'notifications/update': reducers.notificationsUpdate,
  }

  // return function from pagesReducerMap if it exists otherwiese return the given state 
  return reducer[action.type] 
    ? reducer[action.type](state, action, $eventbus)
    : state
}
