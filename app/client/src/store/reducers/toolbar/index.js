/*
 * toolbar reducer
 */
import { mergeDeepRight } from 'ramda'
import { applicationState } from '../../state.js'
import * as reducers from './reducers.js'
import reducerFromMap from '@lib/reducerFromMap.js' 

// map instead of switch statement
const reducerMap = {
  'init': () => applicationState.toolbar,
  'projectInit': () => applicationState.toolbar,
  'toolbar/add': reducers.toolbarAdd,
  'toolbar/update': (state, action) => mergeDeepRight(state, action.payload)
}

export default reducerFromMap(reducerMap)
