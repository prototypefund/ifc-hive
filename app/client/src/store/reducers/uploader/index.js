/*
 * uploade reducer
 */
import { applicationState } from '../../state'
import { mergeDeepRight } from 'ramda'
import reducerFromMap from '@lib/reducerFromMap.js' 

// map instead of switch statement
const reducerMap = {
  'init': () => applicationState.uploader,
  'projectInit': () => applicationState.uploader,
  'uploader/add': (state, action) => mergeDeepRight(state, action.payload),  
  'uploader/remove': (action) => JSON.parse(JSON.stringify(action.payload)),  
}

export default reducerFromMap(reducerMap)
