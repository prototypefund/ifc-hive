/*
 * notification reducer
 */
import * as reducers from './reducers.js'
import reducerFromMap from '@lib/reducerFromMap.js'
import { applicationState } from '../../state'

const reducerMap = {
  'init': () => applicationState.notifications,
  'projectInit': () => applicationState.notifications,
  'notifications/add': reducers.notificationsAdd,
  'notifications/clear': reducers.notifacationsClear,
  'notifications/markAllAsSeen': reducers.notificationsMarkAllAsSeen,
  'notifications/markAllAsRead': reducers.notificationsMarkAllAsRead,
  'notifications/markAsRead': reducers.notificationsMarkAsRead,
  'notifications/markUnread': reducers.notificationsMarkUnread,
  'notifications/toggle': reducers.notificationsToggle,
  'notifications/update': reducers.notificationsUpdate,
}

export default reducerFromMap(reducerMap)
