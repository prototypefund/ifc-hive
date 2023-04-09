/*
 * project reducer
 */
import { applicationState } from '../../state'
import reducerFromMap from '@lib/reducerFromMap.js' 

// map instead of switch statement
const reducerMap = {
  'init': () => applicationState.project,
  'project/addlist':  (state, action) => ({ ...state, ...{ list: action.payload } }),
  'project/addlookup': (state, action) => ({ ...state, ... { lookup: action.payload } }),
  'project/setId': (state, action) => ({ ...state, ...{ id: action.payload } }),
}

export default reducerFromMap(reducerMap)
