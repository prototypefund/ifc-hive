/*
 * socket reducer
 */
import { applicationState } from '../../state'
import reducerFromMap from '@lib/reducerFromMap.js' 

/*
 * set socket status
 */
function socketStatus (state, action) {
  const tempState = JSON.parse(JSON.stringify(state))
  const socketState = {...tempState, ...action.payload}
  return socketState
}

// map instead of switch statement
const reducerMap = {
  'init': () => applicationState.socket,
  'socket/status': socketStatus,
}

export default reducerFromMap(reducerMap)
