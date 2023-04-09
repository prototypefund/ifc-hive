/*
 * queries reducer
 */
import { applicationState } from '../../state'
import * as reducers from './reducers.js'
import reducerFromMap from '@lib/reducerFromMap.js' 
import { mergeDeepRight } from 'ramda'

const reducerMap = {
  'init': () => applicationState.currentPage,
  'currentPage/set': reducers.currentPageSet,
  'currentPage/update': (state, action) => mergeDeepRight(state, action.payload),
}

export default reducerFromMap(reducerMap)

