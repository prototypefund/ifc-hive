import { applicationState } from '../../state'

/*
 * set socket status
 */
function socketStatus (state, action) {
  const tempState = JSON.parse(JSON.stringify(state))
  const socketState = {...tempState, ...action.payload}
  return socketState
}

/*
 * socket reducer
 */
export default ($eventbus) => (state, action) => {
  // early return if no state at all
  if (!state) return

  // map instead of switch statement
  const reducer = {
    'init': () => applicationState.socket,
    'socket/status': socketStatus,
  }

  // return function from pagesReducerMap if it exists otherwiese return the given state 
  return reducer[action.type] 
    ? reducer[action.type](state, action, $eventbus)
    : state
}
