import { applicationState } from '../../state'
import reducerFromMap from '@lib/reducerFromMap.js' 

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
 * define map
 */
const reducerMap = {
  'init': () => applicationState.user,
  'user/set': userSet,
  'user/update': userUpdate,
}

export default reducerFromMap(reducerMap)
