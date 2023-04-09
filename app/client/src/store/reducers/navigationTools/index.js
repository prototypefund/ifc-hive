/*
 * navigatino tools reducer
 */
import * as reducers from './reducers.js'
import reducerFromMap from '@lib/reducerFromMap.js' 
import { applicationState } from '../../state'

// map instead of switch statement
const reducerMap = {
  'init': () =>  applicationState.navigationTools,
  'projectInit': () =>  applicationState.navigationTools,
  'navigationTools/add': reducers.navigationToolsAdd,
  'navigationTools/update': reducers.navigationToolsUpdate,
}

export default reducerFromMap(reducerMap)
