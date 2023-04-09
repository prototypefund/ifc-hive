/*
 * route reducer
 */
import { applicationState } from '../../state'
import reducerFromMap from '@lib/reducerFromMap.js' 

// map instead of switch statement
const reducerMap = {
  'init': () => applicationState.route,
  'project/update':  (action) => JSON.parse(JSON.stringify(action.payload)),
}

export default reducerFromMap(reducerMap)
