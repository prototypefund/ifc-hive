/*
 * organization reducer
 */
import { applicationState } from '../../state'
import reducerFromMap from '@lib/reducerFromMap.js' 

// map instead of switch statement
const reducerMap = {
  'init': () => applicationState.organization,
  'organization/update': (action) => action.payload,
}

export default reducerFromMap(reducerMap)
