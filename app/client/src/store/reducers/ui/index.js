/*
 * ui reducer
 */
import { applicationState } from '../../state'
import * as reducers from './reducers.js'
import reducerFromMap from '@lib/reducerFromMap.js' 

// map instead of switch statement
const reducerMap = {
  'init': () => applicationState.ui,
  'projectInit': reducers.projectInit,
  'currentPage/set': reducers.currentPageSet,  
  'ui/toggle': reducers.uiToggle,  
  'ui/update': reducers.uiUpdate,  
}

export default reducerFromMap(reducerMap)
