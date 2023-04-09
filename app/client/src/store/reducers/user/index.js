import { applicationState } from '../../state'

/*
 * set user
 */
function userSet (state, action) {
  if (state._id) return state
  return action.payload
}

/*
 * update user
 */
function userUpdate (state, action) {
  const userState = JSON.parse(JSON.stringify(state))
  return { ...userState, ...action.payload }
}

/*
 * user reducer
 */
export default ($eventbus) => (state, action) => {
  if (!state) return 

  const reducer = {
    'init': () => applicationState.user,
    'user/set': userSet,
    'user/update': userUpdate,
  }

  // return function from pagesReducerMap if it exists otherwiese return the given state 
  return reducer[action.type] 
    ? reducer[action.type](state, action, $eventbus)
    : state
}
